import { MachineComponent, SuctionSystemConfig, MaterialFeedConfig, FabricRoutingConfig } from '../types/machine';
import { Language } from '../i18n/translations';

export interface MachinePreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  components: MachineComponent[];
  suctionConfig: SuctionSystemConfig;
  materialConfig: MaterialFeedConfig;
  fabricRouting?: FabricRoutingConfig;
}

export const PRESETS: MachinePreset[] = [
  {
    id: 'preset_standard_1_drum',
    name: 'Máy xé vải 1 trống xé tiêu chuẩn',
    badge: 'Phổ biến nhất',
    description: 'Cấu hình chuẩn cho xé giẻ vụn may mặc, vải thun, gồm cặp trục kẹp ép, dao gạt tĩnh, trống xé gai 500mm và ống hút chân không.',
    suctionConfig: {
      active: true,
      airflowRate: 3800,
      airVelocity: 24.5,
      ductDiameter: 220,
      filterDifferentialPressure: 220,
    },
    materialConfig: {
      materialName: 'Vải vụn Denim / Cotton',
      materialType: 'cotton_denim',
      feedSpeedMPerMin: 12.0,
      feedDirection: 'left_to_right',
      basisWeightGsm: 420,
      feedRateKgPerHour: 280,
      nominalTensionN: 140,
    },
    fabricRouting: {
      autoRoute: true,
      steps: [
        { rollerId: 'feed_bottom', wrapMode: 'tangent', enabled: true },
        { rollerId: 'cutter_fixed', wrapMode: 'tangent', enabled: true },
        { rollerId: 'main_cylinder_1', wrapMode: 'under', enabled: true },
      ],
      clothWidthMm: 850,
      clothColor: '#3b82f6',
      fiberTuftParticles: true,
    },
    components: [
      {
        id: 'feed_top',
        name: 'Trục Ép Trên (Feed Upper)',
        type: 'feed_roller',
        x: 120,
        y: 285,
        diameter: 150,
        length: 1050,
        rpm: 25,
        rotationDir: 'CW',
        surfaceType: 'fluted_steel',
        teethDensity: 24,
        color: '#64748b',
      },
      {
        id: 'feed_bottom',
        name: 'Trục Ép Dưới (Feed Lower)',
        type: 'feed_roller',
        x: 120,
        y: 130,
        diameter: 150,
        length: 1050,
        rpm: 25,
        rotationDir: 'CCW',
        surfaceType: 'fluted_steel',
        teethDensity: 24,
        color: '#475569',
      },
      {
        id: 'cutter_fixed',
        name: 'Dao Cắt Tĩnh Dưới (Fixed Knife)',
        type: 'cutter_knife',
        x: 212,
        y: 110,
        diameter: 32,
        length: 1050,
        rpm: 0,
        rotationDir: 'STATIC',
        surfaceType: 'blade',
        color: '#ef4444',
      },
      {
        id: 'main_cylinder_1',
        name: 'Trống Xé Chính (Main Cylinder)',
        type: 'main_drum',
        x: 480,
        y: 250,
        diameter: 500,
        length: 1050,
        rpm: 820,
        rotationDir: 'CCW',
        surfaceType: 'wire_teeth',
        teethDensity: 80,
        color: '#0284c7',
      },
      {
        id: 'suction_hood_1',
        name: 'Miệng Hút Gom Bông (Suction Hood)',
        type: 'suction_hood',
        x: 650,
        y: 530,
        diameter: 180,
        length: 1100,
        rpm: 0,
        rotationDir: 'STATIC',
        surfaceType: 'mesh_perforated',
        color: '#10b981',
      },
      {
        id: 'condenser_drum_1',
        name: 'Trống Ngưng Kết (Condenser Drum)',
        type: 'condenser_drum',
        x: 880,
        y: 320,
        diameter: 280,
        length: 1050,
        rpm: 48,
        rotationDir: 'CCW',
        surfaceType: 'mesh_perforated',
        color: '#8b5cf6',
      },
    ],
  },
  {
    id: 'preset_carding_worker_stripper',
    name: 'Máy xé chải tinh (Worker & Stripper Rollers)',
    badge: 'Độ tơi xơ cao',
    description: 'Bổ sung các cặp trục chải (Worker) và trục bóc (Stripper) áp sát mặt trống xé với cự ly chuẩn 2.0 mm để tăng tối đa độ tơi xốp của bông thành phẩm.',
    suctionConfig: {
      active: true,
      airflowRate: 4500,
      airVelocity: 26.0,
      ductDiameter: 250,
      filterDifferentialPressure: 280,
    },
    materialConfig: {
      materialName: 'Vải dệt kim (Knit) pha Polyester',
      materialType: 'knit_cotton',
      feedSpeedMPerMin: 14.5,
      feedDirection: 'left_to_right',
      basisWeightGsm: 320,
      feedRateKgPerHour: 340,
      nominalTensionN: 110,
    },
    fabricRouting: {
      autoRoute: true,
      steps: [
        { rollerId: 'feed_bottom_2', wrapMode: 'tangent', enabled: true },
        { rollerId: 'cutter_knife_2', wrapMode: 'tangent', enabled: true },
        { rollerId: 'main_cylinder_2', wrapMode: 'under', enabled: true },
        { rollerId: 'worker_roller_1', wrapMode: 'carding_gap', enabled: true },
        { rollerId: 'stripper_roller_1', wrapMode: 'carding_gap', enabled: true },
      ],
      clothWidthMm: 850,
      clothColor: '#3b82f6',
      fiberTuftParticles: true,
    },
    components: [
      {
        id: 'feed_top_2',
        name: 'Trục Ép Trên',
        type: 'feed_roller',
        x: 100,
        y: 285,
        diameter: 140,
        length: 1100,
        rpm: 28,
        rotationDir: 'CW',
        surfaceType: 'fluted_steel',
        color: '#64748b',
      },
      {
        id: 'feed_bottom_2',
        name: 'Trục Ép Dưới',
        type: 'feed_roller',
        x: 100,
        y: 140,
        diameter: 140,
        length: 1100,
        rpm: 28,
        rotationDir: 'CCW',
        surfaceType: 'fluted_steel',
        color: '#475569',
      },
      {
        id: 'cutter_knife_2',
        name: 'Dao Cắt Dưới',
        type: 'cutter_knife',
        x: 188,
        y: 118,
        diameter: 30,
        length: 1100,
        rpm: 0,
        rotationDir: 'STATIC',
        surfaceType: 'blade',
        color: '#ef4444',
      },
      {
        id: 'main_cylinder_2',
        name: 'Trống Xé Chính Lớn',
        type: 'main_drum',
        x: 480,
        y: 280,
        diameter: 550,
        length: 1100,
        rpm: 850,
        rotationDir: 'CCW',
        surfaceType: 'wire_teeth',
        teethDensity: 96,
        color: '#0284c7',
      },
      {
        id: 'worker_roller_1',
        name: 'Trục Chải Worker #1',
        type: 'worker_roller',
        x: 395,
        y: 580,
        diameter: 160,
        length: 1100,
        rpm: 35,
        rotationDir: 'CW',
        surfaceType: 'wire_teeth',
        teethDensity: 64,
        color: '#f59e0b',
      },
      {
        id: 'stripper_roller_1',
        name: 'Trục Bóc Stripper #1',
        type: 'stripper_roller',
        x: 545,
        y: 575,
        diameter: 130,
        length: 1100,
        rpm: 120,
        rotationDir: 'CCW',
        surfaceType: 'wire_teeth',
        teethDensity: 48,
        color: '#ec4899',
      },
      {
        id: 'suction_hood_2',
        name: 'Họng Hút Li Tâm',
        type: 'suction_hood',
        x: 740,
        y: 520,
        diameter: 200,
        length: 1150,
        rpm: 0,
        rotationDir: 'STATIC',
        surfaceType: 'mesh_perforated',
        color: '#10b981',
      },
      {
        id: 'condenser_drum_2',
        name: 'Trống Ngưng Kết Hút Bông',
        type: 'condenser_drum',
        x: 960,
        y: 350,
        diameter: 300,
        length: 1100,
        rpm: 55,
        rotationDir: 'CCW',
        surfaceType: 'mesh_perforated',
        color: '#8b5cf6',
      },
    ],
  },
  {
    id: 'preset_cascading_3_drum',
    name: 'Dây chuyền xé liên hoàn 3 trống (3-Stage Opener)',
    badge: 'Năng suất công nghiệp',
    description: 'Hệ thống 3 trống xé chuyển tiếp liên hoàn, từ mở thô ban đầu đến chải bông mịn thành phẩm với các cửa hút trung gian.',
    suctionConfig: {
      active: true,
      airflowRate: 7200,
      airVelocity: 25.5,
      ductDiameter: 300,
      filterDifferentialPressure: 310,
    },
    materialConfig: {
      materialName: 'Vải vụn công nghiệp pha tổng hợp',
      materialType: 'blended_waste',
      feedSpeedMPerMin: 18.0,
      feedDirection: 'left_to_right',
      basisWeightGsm: 500,
      feedRateKgPerHour: 520,
      nominalTensionN: 180,
    },
    components: [
      {
        id: 'feed_top_3',
        name: 'Cặp Cấp Liệu Thô (Trên)',
        type: 'feed_roller',
        x: 90,
        y: 280,
        diameter: 150,
        length: 1200,
        rpm: 32,
        rotationDir: 'CW',
        surfaceType: 'fluted_steel',
        color: '#64748b',
      },
      {
        id: 'feed_bottom_3',
        name: 'Cặp Cấp Liệu Thô (Dưới)',
        type: 'feed_roller',
        x: 90,
        y: 125,
        diameter: 150,
        length: 1200,
        rpm: 32,
        rotationDir: 'CCW',
        surfaceType: 'fluted_steel',
        color: '#475569',
      },
      {
        id: 'drum_stage_1',
        name: 'Trống Xé Thô #1 (Ø500)',
        type: 'main_drum',
        x: 410,
        y: 240,
        diameter: 480,
        length: 1200,
        rpm: 720,
        rotationDir: 'CCW',
        surfaceType: 'wire_teeth',
        teethDensity: 60,
        color: '#0284c7',
      },
      {
        id: 'drum_stage_2',
        name: 'Trống Xé Vừa #2 (Ø500)',
        type: 'main_drum',
        x: 910,
        y: 240,
        diameter: 480,
        length: 1200,
        rpm: 820,
        rotationDir: 'CCW',
        surfaceType: 'wire_teeth',
        teethDensity: 80,
        color: '#0369a1',
      },
      {
        id: 'drum_stage_3',
        name: 'Trống Xé Tinh #3 (Ø500)',
        type: 'main_drum',
        x: 1410,
        y: 240,
        diameter: 480,
        length: 1200,
        rpm: 950,
        rotationDir: 'CCW',
        surfaceType: 'wire_teeth',
        teethDensity: 110,
        color: '#075985',
      },
      {
        id: 'suction_exhaust_3',
        name: 'Đường Hút Chính Tổng',
        type: 'suction_hood',
        x: 1620,
        y: 480,
        diameter: 240,
        length: 1200,
        rpm: 0,
        rotationDir: 'STATIC',
        surfaceType: 'mesh_perforated',
        color: '#10b981',
      },
    ],
  },
];

export function getLocalizedComponentName(name: string, lang: Language): string {
  if (lang === 'vi') return name;

  const translationsMap: Record<string, string> = {
    'Trục Ép Trên (Feed Upper)': 'Upper Feed Roller',
    'Trục Ép Dưới (Feed Lower)': 'Lower Feed Roller',
    'Dao Cắt Tĩnh Dưới (Fixed Knife)': 'Fixed Bottom Knife',
    'Trống Xé Chính (Main Cylinder)': 'Main Tearing Cylinder',
    'Miệng Hút Gom Bông (Suction Hood)': 'Fiber Suction Hood',
    'Trống Ngưng Kết (Condenser Drum)': 'Condenser Screen Drum',
    'Trục Ép Trên': 'Upper Feed Roller',
    'Trục Ép Dưới': 'Lower Feed Roller',
    'Dao Cắt Dưới': 'Fixed Bottom Knife',
    'Trống Xé Chính Lớn': 'Heavy Main Cylinder',
    'Trục Chải Worker #1': 'Worker Carding Roller #1',
    'Trục Bóc Stripper #1': 'Stripper Roller #1',
    'Họng Hút Li Tâm': 'Centrifugal Suction Hood',
    'Trống Ngưng Kết Hút Bông': 'Suction Condenser Drum',
    'Cặp Cấp Liệu Thô (Trên)': 'Coarse Feed Roller (Upper)',
    'Cặp Cấp Liệu Thô (Dưới)': 'Coarse Feed Roller (Lower)',
    'Trống Xé Thô #1 (Ø500)': 'Coarse Opener Cylinder #1 (Ø500)',
    'Trống Xé Vừa #2 (Ø500)': 'Medium Opener Cylinder #2 (Ø500)',
    'Trống Xé Tinh #3 (Ø500)': 'Fine Carding Cylinder #3 (Ø500)',
    'Đường Hút Chính Tổng': 'Main Exhaust Suction Duct',
    'Trục Ép Trên (Feed Roller)': 'Upper Feed Roller',
    'Trục Ép Dưới (Feed Roller)': 'Lower Feed Roller',
    'Trống Xé Chính (Main Drum)': 'Main Tearing Cylinder',
  };

  if (translationsMap[name]) return translationsMap[name];

  // Pattern translations
  let en = name
    .replace(/Trục Ép Trên/gi, 'Upper Feed Roller')
    .replace(/Trục Ép Dưới/gi, 'Lower Feed Roller')
    .replace(/Trục Ép/gi, 'Feed Roller')
    .replace(/Trục Chải/gi, 'Worker Roller')
    .replace(/Trục Bóc/gi, 'Stripper Roller')
    .replace(/Trống Xé Chính/gi, 'Main Opener Cylinder')
    .replace(/Trống Xé Thô/gi, 'Coarse Opener Cylinder')
    .replace(/Trống Xé Vừa/gi, 'Medium Opener Cylinder')
    .replace(/Trống Xé Tinh/gi, 'Fine Carding Cylinder')
    .replace(/Trống Xé/gi, 'Tearing Drum')
    .replace(/Dao Cắt Tĩnh/gi, 'Fixed Bed Knife')
    .replace(/Dao Cắt/gi, 'Cutter Knife')
    .replace(/Miệng Hút/gi, 'Suction Hood')
    .replace(/Trống Ngưng Kết/gi, 'Condenser Drum')
    .replace(/Đường Hút/gi, 'Suction Duct')
    .replace(/Cặp Cấp Liệu/gi, 'Feed Nip Pair')
    .replace(/\(Bản sao\)/gi, '(Copy)')
    .replace(/\(Bản lưu\)/gi, '(Saved)')
    .replace(/Dàn máy mới/gi, 'New Machine Model')
    .replace(/Dàn máy 1 trống tiêu chuẩn/gi, 'Standard 1-Drum Machine')
    .replace(/Mẫu dàn máy tự thiết kế/gi, 'Custom designed machine model');

  return en;
}

export function getLocalizedPresets(lang: Language): MachinePreset[] {
  if (lang === 'vi') return PRESETS;

  return PRESETS.map((p) => {
    let name = p.name;
    let badge = p.badge;
    let description = p.description;
    let materialName = p.materialConfig.materialName;

    if (p.id === 'preset_standard_1_drum') {
      name = 'Standard 1-Drum Textile Opener';
      badge = 'Most Popular';
      description = 'Standard setup for garment scrap and knit fabric, featuring feed nip rollers, fixed knife, 500mm pinned drum and vacuum duct.';
      materialName = 'Garment Denim / Cotton Scrap';
    } else if (p.id === 'preset_carding_worker_stripper') {
      name = 'Fine Carding Opener (Worker & Stripper)';
      badge = 'High Fiber Loft';
      description = 'Adds pairs of worker and stripper satellite rollers set close to the main drum at a 2.0mm gauge to maximize fiber opening quality.';
      materialName = 'Knit Cotton & Polyester Blend';
    } else if (p.id === 'preset_cascading_3_drum') {
      name = '3-Stage Cascading Opener Line';
      badge = 'Industrial Capacity';
      description = 'Continuous 3-drum cascading system from coarse opening to fine carding with intermediate suction exhausts.';
      materialName = 'Industrial Blended Textile Waste';
    }

    return {
      ...p,
      name,
      badge,
      description,
      materialConfig: {
        ...p.materialConfig,
        materialName,
      },
      components: p.components.map((c) => ({
        ...c,
        name: getLocalizedComponentName(c.name, 'en'),
      })),
    };
  });
}
