import { MachineComponent, SuctionSystemConfig, MaterialFeedConfig, ClearanceItem, TensionSegment, TechnicalConflict } from '../types/machine';
import { Language } from '../i18n/translations';
import { getLocalizedComponentName } from './presets';

// Tính toán vận tốc dài bề mặt trục (m/phút)
export function getLinearVelocity(diameterMm: number, rpm: number): number {
  return Number(((Math.PI * diameterMm * rpm) / 1000).toFixed(1));
}

// Chuyển đổi giữa RPM và tần số biến tần Hz
// Công thức thực tế: Với động cơ truyền động qua biến tần, ở tần số chuẩn 50Hz trục đạt RPM định mức.
// f (Hz) = (RPM / nominalRPM) * 50
export function rpmToHz(rpm: number, nominalRpm = 800): number {
  if (rpm <= 0) return 0;
  const base = nominalRpm > 0 ? nominalRpm : 800;
  return Number(Math.max(5, Math.min(75, (rpm / base) * 50)).toFixed(1));
}

export function hzToRpm(hz: number, nominalRpm = 800): number {
  if (hz <= 0) return 0;
  const base = nominalRpm > 0 ? nominalRpm : 800;
  return Math.round((hz / 50) * base);
}

// Định dạng hiển thị tốc độ theo đơn vị Hz hoặc RPM hoặc song song
export function formatSpeedDisplay(rpm: number, hz?: number, mode: 'hz' | 'rpm' = 'hz', lang: Language = 'vi'): string {
  if (rpm === 0) return lang === 'vi' ? 'Tĩnh (0)' : 'Static (0)';
  const calcHz = hz !== undefined ? hz : rpmToHz(rpm);
  if (mode === 'hz') {
    return `${calcHz} Hz (~${rpm} RPM)`;
  }
  return `${rpm} RPM (~${calcHz} Hz)`;
}

// Tính năng suất nạp liệu vải thực tế
export function calculateMaterialFeedRate(
  speedMPerMin: number,
  widthMm = 850,
  gsm = 350,
  layers = 2
): { kgPerHour: number; kgPerShift: number; linearMeterPerHour: number } {
  const widthM = widthMm / 1000;
  const linearMeterPerHour = speedMPerMin * 60;
  const kgPerHour = Number(((linearMeterPerHour * widthM * gsm * layers) / 1000).toFixed(1));
  const kgPerShift = Number((kgPerHour * 8).toFixed(0));
  return { kgPerHour, kgPerShift, linearMeterPerHour };
}

// Tính khoảng cách tâm và khe hở giữa 2 chi tiết (mm)
export function calculateGap(compA: MachineComponent, compB: MachineComponent): { centerDist: number; gapMm: number } {
  const dx = compA.x - compB.x;
  const dy = compA.y - compB.y;
  const centerDist = Math.hypot(dx, dy);

  // Đường kính danh nghĩa bao ngoài (Outer Envelope / Needle Tip Diameter):
  // - Trống lớn & Trục chải: comp.diameter tính đến đỉnh răng kim (Tip-to-Tip)
  // - Trục cấp liệu (Feed roller): comp.diameter tính đến mặt tang tiếp xúc
  // - Dao cắt (Cutter knife): comp.diameter là chiều rộng bao của cụm lưỡi dao
  // Khe hở làm việc (Gauge clearance) = khoảng cách tâm - tổng bán kính bao ngoài:
  const gapMm = centerDist - (compA.diameter / 2 + compB.diameter / 2);
  return {
    centerDist: Number(centerDist.toFixed(2)),
    gapMm: Number(gapMm.toFixed(2)),
  };
}

// Ngưỡng khuyến nghị cự ly chuẩn cho từng cặp chi tiết
function getRecommendedGapRange(typeA: string, typeB: string): { min: number; max: number } {
  const pair = [typeA, typeB].sort().join(':');
  switch (pair) {
    case 'cutter_knife:main_drum':
      return { min: 1.0, max: 2.0 }; // Dao cắt tới trống: 1.0 - 2.0 mm
    case 'main_drum:worker_roller':
      return { min: 1.5, max: 3.0 }; // Trống lớn tới trục chải: 1.5 - 3.0 mm
    case 'stripper_roller:worker_roller':
      return { min: 1.0, max: 2.5 }; // Trục bóc tới trục chải: 1.0 - 2.5 mm
    case 'main_drum:stripper_roller':
      return { min: 1.2, max: 2.8 }; // Trống lớn tới trục bóc
    case 'feed_roller:feed_roller':
      return { min: 0.5, max: 2.5 }; // Cặp trục ép cấp liệu: 0.5 - 2.5 mm
    case 'feed_roller:main_drum':
      return { min: 2.0, max: 4.5 }; // Trục cấp liệu tới trống xé
    case 'main_drum:suction_hood':
      return { min: 30.0, max: 80.0 }; // Miệng hút tới trống
    default:
      return { min: 2.0, max: 15.0 };
  }
}

// Phân tích ma trận cự ly và phát hiện va chạm cơ khí
export function analyzeClearances(components: MachineComponent[], lang: Language = 'vi'): ClearanceItem[] {
  const results: ClearanceItem[] = [];

  for (let i = 0; i < components.length; i++) {
    for (let j = i + 1; j < components.length; j++) {
      const a = components[i];
      const b = components[j];

      // Bỏ qua miệng hút khi xét va chạm kim loại nếu khoảng cách xa
      if (a.type === 'suction_hood' && b.type === 'suction_hood') continue;

      const { centerDist, gapMm } = calculateGap(a, b);
      const { min, max } = getRecommendedGapRange(a.type, b.type);

      // Chỉ theo dõi những cặp tương đối gần nhau (< 120mm) để tránh làm rối bảng
      if (gapMm < 120) {
        let status: ClearanceItem['status'] = 'optimal';
        if (gapMm < 0) {
          status = 'collision';
        } else if (gapMm < min) {
          status = 'warning_tight';
        } else if (gapMm > max) {
          status = 'warning_wide';
        }

        results.push({
          idA: a.id,
          nameA: getLocalizedComponentName(a.name, lang),
          idB: b.id,
          nameB: getLocalizedComponentName(b.name, lang),
          centerDistance: centerDist,
          gapMm,
          status,
          recommendedGapMin: min,
          recommendedGapMax: max,
        });
      }
    }
  }

  // Ưu tiên hiển thị va chạm lên đầu
  return results.sort((a, b) => a.gapMm - b.gapMm);
}

// Phân tích lực căng vải và chuỗi kéo sợi theo thời gian thực
export function analyzeTensionFlow(
  components: MachineComponent[],
  materialConfig: MaterialFeedConfig,
  lang: Language = 'vi'
): TensionSegment[] {
  // Lọc các trục có tiếp xúc vải (theo thứ tự X tăng dần từ cấp vào đến xuất ra)
  const activeRollers = components
    .filter((c) => c.type !== 'suction_hood' && c.type !== 'cutter_knife' && c.rotationDir !== 'STATIC')
    .sort((a, b) => {
      return materialConfig.feedDirection === 'left_to_right' ? a.x - b.x : b.x - a.x;
    });

  const segments: TensionSegment[] = [];
  const baseTension = materialConfig.nominalTensionN;

  for (let i = 0; i < activeRollers.length - 1; i++) {
    const from = activeRollers[i];
    const to = activeRollers[i + 1];

    const v1 = getLinearVelocity(from.diameter, from.rpm);
    const v2 = getLinearVelocity(to.diameter, to.rpm);

    // Tỉ số bội giác kéo dài (Draft ratio)
    const speedRatio = v1 > 0 ? Number((v2 / v1).toFixed(2)) : 1.0;

    // Tính lực căng vải xấp xỉ dựa trên độ giãn và chênh lệch tốc độ
    let tension = baseTension;
    if (v1 > 0) {
      const deltaRatio = (v2 - v1) / v1;
      tension = Math.max(5, Math.round(baseTension * (1 + deltaRatio * 1.8)));
    }

    let status: TensionSegment['status'] = 'optimal';
    if (speedRatio < 0.9) {
      status = 'slack_wrap'; // Đùn vải, nguy cơ quấn trục
    } else if (tension > 550) {
      status = 'critical_snap'; // Quá căng, nguy cơ đứt vải rách xơ
    } else if (tension > 350 || speedRatio > 2.8) {
      status = 'warning_high';
    }

    segments.push({
      fromId: from.id,
      fromName: getLocalizedComponentName(from.name, lang),
      toId: to.id,
      toName: getLocalizedComponentName(to.name, lang),
      v1,
      v2,
      speedRatio,
      tensionN: tension,
      status,
    });
  }

  return segments;
}

// Phân tích toàn diện và cảnh báo lỗi kỹ thuật tự động (Bilingual: VI / EN)
export function evaluateMachineHealth(
  components: MachineComponent[],
  suctionConfig: SuctionSystemConfig,
  materialConfig: MaterialFeedConfig,
  clearances: ClearanceItem[],
  tensions: TensionSegment[],
  lang: Language = 'vi'
): TechnicalConflict[] {
  const conflicts: TechnicalConflict[] = [];
  const isEn = lang === 'en';

  // 1. Kiểm tra Va chạm cơ khí trực diện (Gap < 0mm)
  clearances.forEach((c) => {
    const nameA = getLocalizedComponentName(c.nameA, lang);
    const nameB = getLocalizedComponentName(c.nameB, lang);

    if (c.gapMm < 0) {
      conflicts.push({
        id: `col-${c.idA}-${c.idB}`,
        level: 'danger',
        title: isEn
          ? `Severe Mechanical Collision: ${nameA} & ${nameB}`
          : `Va chạm cơ khí nghiêm trọng: ${nameA} & ${nameB}`,
        description: isEn
          ? `Components intersect by ${Math.abs(c.gapMm)} mm. Card clothing teeth or knife blades will break and cause sparks/fire upon startup!`
          : `Hai bề mặt đang giao nhau (${c.gapMm} mm). Răng xé hoặc dao cắt sẽ bị gãy và phát tia lửa gây cháy nổ nếu khởi động!`,
        affectedComponents: [c.idA, c.idB],
        recommendation: isEn
          ? `Shift roller coordinates or calibrate gap clearance to minimum ${c.recommendedGapMin} mm.`
          : `Kéo dời vị trí tâm trục hoặc tinh chỉnh cự ly khe hở đạt tối thiểu ${c.recommendedGapMin} mm.`,
        category: 'mechanical_collision',
      });
    } else if (c.status === 'warning_tight') {
      conflicts.push({
        id: `tight-${c.idA}-${c.idB}`,
        level: 'warning',
        title: isEn
          ? `Clearance Too Tight: ${nameA} & ${nameB} (${c.gapMm} mm)`
          : `Khe hở quá hẹp: ${nameA} & ${nameB} (${c.gapMm} mm)`,
        description: isEn
          ? `Clearance is smaller than safe engineering limit (${c.recommendedGapMin} mm). High friction heat can scorch fibers or warp the shaft.`
          : `Cự ly nhỏ hơn mức an toàn kỹ thuật (${c.recommendedGapMin} mm). Nhiệt ma sát cao có thể làm cháy xơ bông hoặc cong vênh trục.`,
        affectedComponents: [c.idA, c.idB],
        recommendation: isEn
          ? `Adjust gap clearance to standard range: ${c.recommendedGapMin} - ${c.recommendedGapMax} mm.`
          : `Điều chỉnh khe hở về dải chuẩn: ${c.recommendedGapMin} - ${c.recommendedGapMax} mm.`,
        category: 'gap_clearance',
      });
    } else if (
      c.status === 'warning_wide' &&
      (c.nameA.toLowerCase().includes('dao') ||
        c.nameB.toLowerCase().includes('dao') ||
        c.nameA.toLowerCase().includes('knife') ||
        c.nameB.toLowerCase().includes('knife') ||
        c.nameA.toLowerCase().includes('worker') ||
        c.nameB.toLowerCase().includes('worker'))
    ) {
      conflicts.push({
        id: `wide-${c.idA}-${c.idB}`,
        level: 'info',
        title: isEn
          ? `Tearing Gap Too Wide: ${nameA} & ${nameB} (${c.gapMm} mm)`
          : `Cự ly xé quá lớn: ${nameA} & ${nameB} (${c.gapMm} mm)`,
        description: isEn
          ? `Clearance exceeds ${c.recommendedGapMax} mm, allowing fabric rags to slip past unopened and lowering fiber yield.`
          : `Khe hở vượt quá ${c.recommendedGapMax} mm khiến vải vụn trôi qua mà không được chải bung, làm giảm năng suất mở xơ.`,
        affectedComponents: [c.idA, c.idB],
        recommendation: isEn
          ? `Close gap closer (< ${c.recommendedGapMax} mm) for optimal carding action.`
          : `Thu hẹp cự ly lại gần hơn (< ${c.recommendedGapMax} mm) để tối ưu lực ghim xé.`,
        category: 'gap_clearance',
      });
    }
  });

  // 2. Kiểm tra Xung đột hướng quay tại cặp Trục Ép Cấp Liệu (Feed Rollers)
  const feedRollers = components.filter((c) => c.type === 'feed_roller');
  if (feedRollers.length >= 2) {
    const sortedY = [...feedRollers].sort((a, b) => b.y - a.y);
    const topRoller = sortedY[0];
    const bottomRoller = sortedY[1];
    const topName = getLocalizedComponentName(topRoller.name, lang);
    const bottomName = getLocalizedComponentName(bottomRoller.name, lang);

    const dx = Math.abs(topRoller.x - bottomRoller.x);
    if (dx < 100) {
      const isLtoR = materialConfig.feedDirection === 'left_to_right';
      const expectedTopDir = isLtoR ? 'CW' : 'CCW';
      const expectedBottomDir = isLtoR ? 'CCW' : 'CW';

      if (topRoller.rotationDir === bottomRoller.rotationDir) {
        conflicts.push({
          id: `feed-jam-same-dir`,
          level: 'danger',
          title: isEn
            ? `Rotation Direction Conflict on Feed Nip Pair`
            : `Xung đột hướng quay cặp trục ép cấp liệu`,
          description: isEn
            ? `Both rollers (${topName} and ${bottomName}) are rotating in ${topRoller.rotationDir}! At the nip point, one pushes forward while the other pushes back, instantly jamming the machine!`
            : `Cả hai trục (${topName} và ${bottomName}) cùng quay chiều ${topRoller.rotationDir}! Tại khe kẹp, một bề mặt đẩy tới còn một bề mặt đẩy lùi, gây vò nát và kẹt vải chết máy ngay lập tức!`,
          affectedComponents: [topRoller.id, bottomRoller.id],
          recommendation: isEn
            ? `Set opposite rotation: ${topName} ${expectedTopDir}, ${bottomName} ${expectedBottomDir}.`
            : `Đổi chiều quay: ${topName} quay ${expectedTopDir}, ${bottomName} quay ${expectedBottomDir}.`,
          category: 'rotation_conflict',
        });
      } else if (topRoller.rotationDir !== expectedTopDir) {
        conflicts.push({
          id: `feed-reverse-dir`,
          level: 'danger',
          title: isEn
            ? `Feed Rollers Rotating Reverse to Material Feed`
            : `Trục cấp liệu quay nghịch hướng nạp liệu`,
          description: isEn
            ? `Current rotation pushes fabric backwards away from the machine instead of pulling it into the opening cylinder.`
            : `Chiều quay hiện tại đang đẩy ngược nguyên liệu vải ra khỏi miệng nạp thay vì cuốn vào buồng xé.`,
          affectedComponents: [topRoller.id, bottomRoller.id],
          recommendation: isEn
            ? `Invert rotation direction of both feed rollers to match ${isLtoR ? 'Left ➔ Right' : 'Right ➔ Left'} feed.`
            : `Đảo ngược chiều quay của cả hai trục cấp liệu để phù hợp với hướng cấp ${isLtoR ? 'Trái ➔ Phải' : 'Phải ➔ Trái'}.`,
          category: 'rotation_conflict',
        });
      }
    }
  }

  // 3. Kiểm tra Trống Xé Chính (Main Drum) vs Chiều nạp liệu & Dao cắt
  const mainDrums = components.filter((c) => c.type === 'main_drum');
  const cutters = components.filter((c) => c.type === 'cutter_knife');

  mainDrums.forEach((drum) => {
    const drumName = getLocalizedComponentName(drum.name, lang);
    if (drum.rpm < 200) {
      conflicts.push({
        id: `drum-low-rpm-${drum.id}`,
        level: 'warning',
        title: isEn
          ? `Opening Cylinder Speed Too Slow (${drum.rpm} RPM)`
          : `Tốc độ trống xé quá chậm (${drum.rpm} RPM)`,
        description: isEn
          ? `Main tearing cylinder requires a minimum peripheral speed of 600 - 1200 m/min to create centrifugal tearing force. Current speed (${getLinearVelocity(drum.diameter, drum.rpm)} m/min) will choke the drum.`
          : `Trống xé chính cần vận tốc dài tối thiểu 600 - 1200 m/phút để tạo lực xé quán tính tách xơ. Tốc độ hiện tại (${getLinearVelocity(drum.diameter, drum.rpm)} m/min) sẽ làm nghẽn trống.`,
        affectedComponents: [drum.id],
        recommendation: isEn
          ? `Increase RPM of ${drumName} to recommended 600 - 1000 RPM.`
          : `Tăng RPM của ${drumName} lên mức khuyến nghị 600 - 1000 RPM.`,
        category: 'tension_jam',
      });
    }

    // Dao cắt tĩnh nằm gần trống xé
    cutters.forEach((knife) => {
      const knifeName = getLocalizedComponentName(knife.name, lang);
      const { gapMm } = calculateGap(drum, knife);
      if (gapMm < 50) {
        if (knife.y < drum.y && drum.rotationDir === 'CW' && knife.x < drum.x) {
          conflicts.push({
            id: `knife-angle-conflict-${knife.id}`,
            level: 'warning',
            title: isEn
              ? `Knife Shear Angle Conflicts with Cylinder Teeth`
              : `Góc chém dao cắt tĩnh ngược chiều răng xé`,
            description: isEn
              ? `Blade position of ${knifeName} directly faces the teeth impact of cylinder ${drumName}, causing wire teeth breakage risk.`
              : `Vị trí lưỡi dao ${knifeName} đang đón ngược trực diện hướng va đập của gai trống xé ${drumName}, gây nguy cơ gãy gai hàng loạt.`,
            affectedComponents: [knife.id, drum.id],
            recommendation: isEn
              ? `Position knife tangentially or reverse cylinder rotation.`
              : `Bố trí dao cắt theo phương trượt tiếp tuyến hoặc đảo chiều quay trống xé.`,
            category: 'rotation_conflict',
          });
        }
      }
    });
  });

  // 4. Kiểm tra Lực căng vải và Nguy cơ Đùn cuộn (Tension Diagnostics)
  tensions.forEach((t) => {
    const fromName = getLocalizedComponentName(t.fromName, lang);
    const toName = getLocalizedComponentName(t.toName, lang);

    if (t.status === 'critical_snap') {
      conflicts.push({
        id: `tension-snap-${t.fromId}-${t.toId}`,
        level: 'danger',
        title: isEn
          ? `Tension Exceeds Material Breaking Limit: ${fromName} ➔ ${toName}`
          : `Lực căng vượt giới hạn chịu tải: ${fromName} ➔ ${toName}`,
        description: isEn
          ? `Instantaneous web tension reached ${t.tensionN} N (Speed ratio ${t.speedRatio}x). Severe risk of fabric breakage or drive belt slip!`
          : `Lực căng tức thời đạt ${t.tensionN} N (Tỉ số tốc độ ${t.speedRatio}x). Nguy cơ xé rách đứt mạch vải bất ngờ hoặc trượt dây curoa truyền động!`,
        affectedComponents: [t.fromId, t.toId],
        recommendation: isEn
          ? `Reduce speed difference between rollers or lower raw material intake weight.`
          : `Giảm chênh lệch tốc độ giữa hai trục hoặc giảm định lượng cấp liệu đầu vào.`,
        category: 'tension_jam',
      });
    } else if (t.status === 'slack_wrap') {
      conflicts.push({
        id: `tension-slack-${t.fromId}-${t.toId}`,
        level: 'warning',
        title: isEn
          ? `Fabric Slack & Roller Wrapping Risk: ${fromName} ➔ ${toName}`
          : `Đùn vải & chùng chềnh: ${fromName} ➔ ${toName}`,
        description: isEn
          ? `Downstream roller is slower than upstream (${t.v2} m/min < ${t.v1} m/min, ratio ${t.speedRatio}x). Fabric bunches up and easily wraps around rollers.`
          : `Tốc độ trục sau chậm hơn trục trước (${t.v2} m/min < ${t.v1} m/min, tỉ số ${t.speedRatio}x). Vải bị đùn ép dồn cục, dễ bị cuốn quấn ngược quanh trục.`,
        affectedComponents: [t.fromId, t.toId],
        recommendation: isEn
          ? `Synchronize speeds: Increase RPM of ${toName} or decrease feed speed of ${fromName}.`
          : `Đồng bộ tốc độ: Tăng RPM của ${toName} hoặc giảm tốc độ cấp liệu của ${fromName}.`,
        category: 'tension_jam',
      });
    }
  });

  // 5. Kiểm tra Hệ thống Hút Bụi & Thu Gom Bông
  const suctionHoods = components.filter((c) => c.type === 'suction_hood');
  if (suctionHoods.length === 0) {
    conflicts.push({
      id: `suction-missing`,
      level: 'warning',
      title: isEn
        ? `No Exhaust Suction Hood Configured`
        : `Chưa có Miệng hút thu gom bụi xơ bông`,
      description: isEn
        ? `Textile tearing generates heavy airborne dust and fine lint. Missing exhaust system leads to chamber clogging and fire hazards.`
        : `Máy xé vải sinh ra lượng bụi mịn và xơ bay rất lớn. Thiếu hệ thống hút sẽ gây nghẽn buồng máy và nguy cơ phát hỏa.`,
      affectedComponents: [],
      recommendation: isEn
        ? `Add at least one Suction Hood above or behind the main opening cylinder.`
        : `Thêm ít nhất 1 Cụm miệng hút gió (Suction Hood) phía trên hoặc sau trống xé chính.`,
      category: 'suction_aerodynamics',
    });
  } else {
    suctionHoods.forEach((hood) => {
      const hoodName = getLocalizedComponentName(hood.name, lang);
      if (suctionConfig.airVelocity < 20) {
        conflicts.push({
          id: `suction-velocity-low-${hood.id}`,
          level: 'warning',
          title: isEn
            ? `Suction Air Velocity Too Low (${suctionConfig.airVelocity} m/s)`
            : `Tốc độ gió hút quá yếu (${suctionConfig.airVelocity} m/s)`,
          description: isEn
            ? `Pneumatic transport of opened cotton fibers requires at least 22 - 26 m/s to prevent settling and duct clogging.`
            : `Để hút vận chuyển xơ bông và giẻ xé mà không bị lắng đọng trong đường ống, vận tốc gió tối thiểu phải đạt 22 - 26 m/s.`,
          affectedComponents: [hood.id],
          recommendation: isEn
            ? `Increase fan airflow or reduce duct diameter to increase air velocity.`
            : `Tăng công suất quạt hút hoặc thu hẹp tiết diện ống hút để tăng vận tốc luồng khí.`,
          category: 'suction_aerodynamics',
        });
      }

      mainDrums.forEach((drum) => {
        const drumName = getLocalizedComponentName(drum.name, lang);
        const { gapMm } = calculateGap(hood, drum);
        if (gapMm > 150) {
          conflicts.push({
            id: `suction-too-far-${hood.id}-${drum.id}`,
            level: 'info',
            title: isEn
              ? `Suction Hood ${hoodName} Too Far From Cylinder (${gapMm} mm)`
              : `Miệng hút ${hoodName} cách quá xa trống xé (${gapMm} mm)`,
            description: isEn
              ? `Excessive distance weakens tangential collection of centrifugal fiber throw, causing lint scattering.`
              : `Khoảng cách quá xa làm giảm lực thu gom xơ văng li tâm từ gai xé, gây thất thoát bông rơi vãi ra sàn máy.`,
            affectedComponents: [hood.id, drum.id],
            recommendation: isEn
              ? `Position hood closer to fiber tangent ejection zone (35 - 70 mm).`
              : `Bố trí miệng hút gần điểm văng xơ li tâm của trống xé (khoảng 35 - 70 mm).`,
            category: 'suction_aerodynamics',
          });
        }
      });
    });
  }

  return conflicts;
}
