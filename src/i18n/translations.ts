export type Language = 'vi' | 'en';

export interface Translations {
  // App branding & Title
  appTitle: string;
  appDescription: string;
  brandSub: string;

  // Header Nav
  navMachine: string;
  navKinematics: string;
  navClearance: string;
  navDiagnostics: string;
  navSuction: string;
  openNewTab: string;
  exportConfig: string;

  // Common buttons & states
  play: string;
  pause: string;
  speed: string;
  undo: string;
  redo: string;
  undoToast: string;
  redoToast: string;
  locked: string;
  lockPosition: string;
  lockedTip: string;
  unlockedTip: string;
  view3D: string;
  view2D: string;
  viewSplit: string;
  grid: string;
  gridStandard: string;
  gridFine: string;
  gridOff: string;
  hud: string;
  hudShow: string;
  cardClothing: string;
  gapsMm: string;
  newTab: string;
  fullscreen: string;
  minimize: string;
  toggleSidebar: string;
  apply: string;
  cancel: string;
  delete: string;
  save: string;
  saved: string;
  saveModel: string;
  savedToast: string;
  createdToast: string;
  renamedToast: string;
  duplicatedToast: string;
  deletedToast: string;
  loadedToast: string;
  loadedStandardToast: string;

  // Model Management & Toolbar
  newModelBtn: string;
  newModelTitle: string;
  newModelDesc: string;
  modelSelectorTitle: string;
  yourSavedModels: string;
  factoryPresets: string;
  quickActions: string;
  createNewModelOption: string;
  fullManagementOption: string;
  noSavedModels: string;
  activeBadge: string;
  itemsCount: string;
  addRollerBtn: string;
  addRollerMenuTitle: string;

  // Fabric & Width Controller
  fabricWidthLabel: string;
  fabricControllerTitle: string;
  feedWidth: string;
  fabricLayers: string;
  layersUnit: string;
  feedSpeed: string;
  speedUnitMPerMin: string;
  fabricColor3D: string;
  supplyRollStand: string;
  showText: string;
  hideText: string;
  fabricWidthNotice: string;

  // Colors
  colorDenim: string;
  colorCotton: string;
  colorBleached: string;
  colorRed: string;
  colorGreen: string;

  // Sidebar Tabs
  tabRollerGap: string;
  tabFabricPath: string;
  tabDiagnostics: string;
  tabTensionAir: string;
  openSettingsBtn: string;

  // Roller Inspector
  noRollerSelectedTitle: string;
  noRollerSelectedDesc: string;
  rollerCoordX: string;
  rollerCoordY: string;
  rollerDiameter: string;
  rollerLength: string;
  rollerRpm: string;
  rollerFreqHz: string;
  rollerLinearSpeed: string;
  rotationDir: string;
  dirCW: string;
  dirCCW: string;
  dirStatic: string;
  surfaceType: string;
  cardClothingSpecs: string;
  toothPitch: string;
  toothHeight: string;
  toothAngle: string;
  techFunction: string;
  enterGap: string;
  applyGap: string;
  duplicateRoller: string;
  deleteRoller: string;
  cardingWrapGapOption: string;
  openCardClothingDetail: string;
  autoShiftNotice: string;
  gapToOther: string;

  // Fabric Routing Panel
  routingPanelTitle: string;
  outputSummaryTitle: string;
  kgPerHour: string;
  kgPerShift: string;
  mPerHour: string;
  feedDirectionLabel: string;
  leftToRight: string;
  rightToLeft: string;
  tuftParticlesLabel: string;
  contactSequenceTitle: string;
  wrapUnder: string;
  wrapOver: string;
  tangentContact: string;
  cardingGapContact: string;

  // Material & Tension HUD
  materialFlowTitle: string;
  materialTypeLabel: string;
  materialDenim: string;
  materialCottonKnit: string;
  materialPoly: string;
  materialBlended: string;
  basisWeightLabel: string;
  nominalTensionLabel: string;
  tensionMonitorTitle: string;
  tensionSegment: string;
  tensionDraftRatio: string;
  tensionForce: string;
  tensionStatus: string;
  suctionSystemTitle: string;
  suctionFanStatus: string;
  airflowRateLabel: string;
  airVelocityLabel: string;
  filterPressureLabel: string;
  ductDiameterLabel: string;

  // Diagnostics Panel
  dangerConflicts: string;
  techWarnings: string;
  optimizations: string;
  diagnosticEngineTitle: string;
  realtimeLabel: string;
  systemOptimalTitle: string;
  systemOptimalDesc: string;
  autoFixBtn: string;
  calibrateGapBtn: string;
  gapMatrixTitle: string;

  // Statuses
  statusCollision: string;
  statusTooTight: string;
  statusTooWide: string;
  statusOptimal: string;
  statusCriticalSnap: string;
  statusSlackWrap: string;
  statusWarningHigh: string;

  // CAD 2D Controls
  scaleLabel: string;
  gridLabel: string;
  freePanMode: string;
  dragSelectMode: string;
  suctionPathLabel: string;
  suctionWidthLabel: string;
  narrowSuctionTip: string;
  expandSuctionTip: string;
  zoomInTip: string;
  zoomOutTip: string;
  fitViewTip: string;
  noAdjacentRollers: string;

  // 3D Viewport Controls
  perspective3D: string;
  frontCutaway: string;
  topDown: string;
  resetViewTip: string;
  rotationRingsLabel: string;
  freeOrbit3D: string;
  clickSelect3D: string;
  needleDensityLabel: string;
  fiberDensityLabel: string;
  supplyRollLabel: string;
  suctionOffsetLabel: string;
  suctionWidthLabelShort: string;
  hudShortcutNotice: string;
  physicalSimLabel: string;
  fiberTuftsCount: string;
  fiberParticlesCount: string;

  // Modals
  gapCalibratorTitle: string;
  gapCalibratorSubtitle: string;
  stationaryRoller: string;
  movingRoller: string;
  targetGapMm: string;
  currentCalculatedGap: string;
  centerDistance: string;
  recommendedGaps: string;
  applyGapBtn: string;

  cardClothingTitle: string;
  cardClothingSubtitle: string;
  realMacroPhotoTab: string;
  diagram2DTab: string;
  wireTypeLabel: string;
  standardCatalogTitle: string;
  applyPresetCardBtn: string;

  exportModalTitle: string;
  exportModalSubtitle: string;
  reportTab: string;
  jsonTab: string;
  copyReportBtn: string;
  copiedSuccess: string;
  downloadReportBtn: string;
  downloadJsonBtn: string;

  savedModalTitle: string;
  savedModalSubtitle: string;
  saveNewConfigTitle: string;
  configNamePlaceholder: string;
  notesPlaceholder: string;
  saveCurrentBtn: string;
  importJsonBtn: string;
  exportAllJsonBtn: string;
  savedListTitle: string;
  loadConfigBtn: string;
  confirmDeleteConfig: string;

  openTabModalTitle: string;
  openTabModalSubtitle: string;
  openTabDesc: string;
  copyLinkBtn: string;
  openDirectTabBtn: string;

  // Roller Type Labels
  rollerMainDrum: string;
  rollerFeed: string;
  rollerWorker: string;
  rollerStripper: string;
  rollerKnife: string;
  rollerSuction: string;
  rollerCondenser: string;

  // Surface Type Labels
  surfaceWireTeeth: string;
  surfaceFlutedSteel: string;
  surfaceSmoothRubber: string;
  surfaceBlade: string;
  surfaceMeshPerforated: string;
}

export const translations: Record<Language, Translations> = {
  vi: {
    appTitle: 'TexTear 3D - Mô Phỏng Máy Xé Vải Công Nghiệp',
    appDescription: 'Phần mềm mô phỏng 3D/2D máy xé vải, cấu hình trục & trống, dao cắt, phân tích cự ly khe hở milimet, kiểm tra xung đột hướng quay, lực căng thời gian thực và hệ thống hút bụi xơ bông.',
    brandSub: 'Mô phỏng máy xé vải dệt may',

    navMachine: 'Mô hình máy',
    navKinematics: 'Động học trục',
    navClearance: 'Khe hở khe dao',
    navDiagnostics: 'Chuẩn đoán lỗi',
    navSuction: 'Hệ thống hút',
    openNewTab: 'Mở tab mới ↗',
    exportConfig: 'Xuất thông số máy',

    play: 'Chạy',
    pause: 'Tạm dừng',
    speed: 'Tốc độ',
    undo: 'Undo',
    redo: 'Redo',
    undoToast: '↶ Đã hoàn tác thao tác',
    redoToast: '↷ Đã làm lại thao tác',
    locked: 'ĐÃ KHÓA',
    lockPosition: 'Khóa vị trí',
    lockedTip: 'Vị trí dàn máy đang BỊ KHÓA cố định. Click để MỞ KHÓA cho phép dịch chuyển',
    unlockedTip: 'Click để KHÓA CỐ ĐỊNH vị trí các trục trên bản vẽ và 3D, tránh vô tình rê chuột làm xê dịch',
    view3D: '3D',
    view2D: '2D CAD',
    viewSplit: 'Chia đôi',
    grid: 'Lưới:',
    gridStandard: '10 mm (Chuẩn)',
    gridFine: '1 mm (Mịn)',
    gridOff: 'Tắt (Tự do)',
    hud: 'HUD [H]',
    hudShow: 'Hiện [H]',
    cardClothing: 'Bề mặt kim',
    gapsMm: 'Khe hở mm',
    newTab: 'Tab mới ↗',
    fullscreen: 'Phóng to toàn màn hình',
    minimize: 'Thu nhỏ cửa sổ',
    toggleSidebar: 'Bảng thông số',
    apply: 'Áp dụng',
    cancel: 'Hủy',
    delete: 'Xóa',
    save: 'Lưu',
    saved: 'Đã lưu',
    saveModel: 'Lưu mẫu *',
    savedToast: '✓ Đã lưu thành công dàn máy',
    createdToast: '+ Đã tạo dàn máy mới. Hãy tự do build máy và bấm "Lưu mẫu"!',
    renamedToast: '✓ Đã đổi tên thành công',
    duplicatedToast: '📋 Đã nhân bản dàn máy',
    deletedToast: '🗑️ Đã xóa mẫu dàn máy',
    loadedToast: '⚡ Đã tải mẫu',
    loadedStandardToast: '⚡ Đã tải mẫu chuẩn',

    newModelBtn: '+ Tạo mẫu mới',
    newModelTitle: '+ Tạo dàn máy mới (Trống trơn)',
    newModelDesc: 'Tự do build sắp đặt các trục theo ý bạn',
    modelSelectorTitle: 'DANH SÁCH MẪU DÀN MÁY',
    yourSavedModels: 'Mẫu bạn đã lưu',
    factoryPresets: 'Mẫu công nghiệp nhà máy',
    quickActions: 'Thao tác nhanh',
    createNewModelOption: '+ Tạo mẫu máy mới...',
    fullManagementOption: '📁 Quản lý chi tiết & Xuất/Nhập JSON...',
    noSavedModels: 'Chưa có mẫu tự lưu nào. Hãy tùy chỉnh máy rồi bấm Lưu mẫu!',
    activeBadge: 'Đang chọn',
    itemsCount: 'chi tiết',
    addRollerBtn: 'Thêm trục',
    addRollerMenuTitle: 'Chọn chi tiết lắp thêm vào máy',

    fabricWidthLabel: 'Khổ vải:',
    fabricControllerTitle: 'ĐIỀU KHIỂN KHỔ VẢI & NGUYÊN LIỆU',
    feedWidth: 'Bề rộng khổ vải cấp vào:',
    fabricLayers: 'Số lớp vải xếp:',
    layersUnit: 'lớp',
    feedSpeed: 'Tốc độ cấp:',
    speedUnitMPerMin: 'm/phút',
    fabricColor3D: 'Màu sắc dải vải 3D:',
    supplyRollStand: 'Cây cuộn vải cấp liệu:',
    showText: 'HIỆN',
    hideText: 'ẨN',
    fabricWidthNotice: '* Khổ vải hỗ trợ tối đa 2000mm (chuẩn dây chuyền xé vải công nghiệp lớn). Tang trống tự động mở rộng theo khổ vải.',

    colorDenim: 'Xanh Denim',
    colorCotton: 'Trắng Cotton',
    colorBleached: 'Xám Tẩy',
    colorRed: 'Đỏ',
    colorGreen: 'Xanh Lá',

    tabRollerGap: 'Trục & Cự ly',
    tabFabricPath: 'Khổ & Vải',
    tabDiagnostics: 'Chẩn đoán',
    tabTensionAir: 'Lực căng',
    openSettingsBtn: 'Mở bảng thông số',

    noRollerSelectedTitle: 'Chưa chọn trục hoặc chi tiết máy nào',
    noRollerSelectedDesc: 'Click chuột vào một quả lô trên bản vẽ 2D hoặc 3D để hiệu chỉnh thông số kỹ thuật.',
    rollerCoordX: 'Tọa độ X',
    rollerCoordY: 'Tọa độ Y',
    rollerDiameter: 'Đường kính Ø',
    rollerLength: 'Chiều dài trục L',
    rollerRpm: 'Tốc độ góc:',
    rollerFreqHz: 'Tần số biến tần:',
    rollerLinearSpeed: 'Vận tốc dài:',
    rotationDir: 'Chiều quay trục:',
    dirCW: '↻ CW (Thuận kim)',
    dirCCW: '↺ CCW (Ngược kim)',
    dirStatic: 'Tĩnh (0 RPM)',
    surfaceType: 'Dạng bề mặt làm việc:',
    cardClothingSpecs: 'Thông Số Đồ Kim Răng Cưa:',
    toothPitch: 'Bước kim p',
    toothHeight: 'Chiều cao H',
    toothAngle: 'Góc nghiêng',
    techFunction: 'Chức năng công nghệ:',
    enterGap: 'Nhập khe:',
    applyGap: 'Áp dụng',
    duplicateRoller: 'Nhân bản chi tiết',
    deleteRoller: 'Xóa chi tiết',
    cardingWrapGapOption: 'Chạy kẹp giữa trục & trống (Trong khe chải)',
    openCardClothingDetail: 'Mở bảng giải phẫu đồ kim & tiêu chuẩn hãng',
    autoShiftNotice: 'Tự động dịch chuyển',
    gapToOther: 'Khe hở tới',

    routingPanelTitle: 'LỘ TRÌNH VẢI & NĂNG SUẤT XÉ',
    outputSummaryTitle: 'Năng suất xé thực tế:',
    kgPerHour: 'Kg/Giờ',
    kgPerShift: 'Kg/Ca (8h)',
    mPerHour: 'm/giờ',
    feedDirectionLabel: 'Hướng di chuyển của vải/bông vào máy:',
    leftToRight: 'Trái ➔ Phải (Tiêu chuẩn)',
    rightToLeft: 'Phải ➔ Trái (Nghịch)',
    tuftParticlesLabel: 'Bung hạt xơ bông (Particle Ejection):',
    contactSequenceTitle: 'Thứ tự các trục tiếp xúc vải:',
    wrapUnder: 'Vòng qua đáy dưới',
    wrapOver: 'Vòng qua đỉnh trên',
    tangentContact: 'Tiếp xúc cắt',
    cardingGapContact: 'Giữa trục & trống (khe chải)',

    materialFlowTitle: 'Luồng Cấp Nguyên Liệu (Vải/Bông)',
    materialTypeLabel: 'Tên & Kiểu vải cấp:',
    materialDenim: 'Vải Denim may mặc (Bền chắc)',
    materialCottonKnit: 'Vải thun dệt kim Cotton (Mềm)',
    materialPoly: 'Xơ sợi tổng hợp Polyester',
    materialBlended: 'Giẻ vụn may mặc tổng hợp',
    basisWeightLabel: 'Định lượng vải (GSM):',
    nominalTensionLabel: 'Lực căng nạp danh định (N):',
    tensionMonitorTitle: 'Giám Sát Lực Căng & Kéo Dãn (Draft Ratio)',
    tensionSegment: 'Phân đoạn trục',
    tensionDraftRatio: 'Tỉ số v2/v1',
    tensionForce: 'Lực căng',
    tensionStatus: 'Trạng thái',
    suctionSystemTitle: 'Hệ Thống Hút Bụi & Thu Gom Xơ Li Tâm',
    suctionFanStatus: 'Trạng thái quạt hút:',
    airflowRateLabel: 'Lưu lượng gió (m³/h):',
    airVelocityLabel: 'Vận tốc gió tại miệng (m/s):',
    filterPressureLabel: 'Chênh áp màng lọc (Pa):',
    ductDiameterLabel: 'Đường kính ống dẫn (mm):',

    dangerConflicts: 'Xung đột nguy hiểm',
    techWarnings: 'Cảnh báo kỹ thuật',
    optimizations: 'Gợi ý tối ưu',
    diagnosticEngineTitle: 'Phân Tích Lỗi Kỹ Thuật Tự Động',
    realtimeLabel: 'Thời gian thực',
    systemOptimalTitle: 'Hệ Thống Vận Hành Hoàn Hảo',
    systemOptimalDesc: 'Không phát hiện xung đột chiều quay, không va chạm cơ khí, lực căng vải và lưu lượng hút đều đạt chuẩn.',
    autoFixBtn: 'Tự Động Khắc Phục Lỗi Này',
    calibrateGapBtn: 'Căn chỉnh cự ly khe hở',
    gapMatrixTitle: 'Cự ly khe hở giữa các quả lô',

    statusCollision: 'Va chạm cơ khí',
    statusTooTight: 'Khe hở quá hẹp',
    statusTooWide: 'Khe hở quá rộng',
    statusOptimal: 'Tối ưu',
    statusCriticalSnap: 'Nguy cơ đứt rách vải',
    statusSlackWrap: 'Chùng chềnh / Đùn vải',
    statusWarningHigh: 'Lực căng cao',

    scaleLabel: 'Tỉ lệ:',
    gridLabel: 'Lưới:',
    freePanMode: 'Di chuyển tự do',
    dragSelectMode: 'Chọn & Kéo trục',
    suctionPathLabel: 'Đường hút:',
    suctionWidthLabel: 'Rộng:',
    narrowSuctionTip: 'Thu hẹp đường hút',
    expandSuctionTip: 'Mở rộng đường hút dưới trục',
    zoomInTip: 'Phóng to',
    zoomOutTip: 'Thu nhỏ',
    fitViewTip: 'Vừa vặn khung nhìn',
    noAdjacentRollers: 'Không có chi tiết lân cận < 120mm',

    perspective3D: 'Phối cảnh 3D',
    frontCutaway: 'Mặt cắt phẳng',
    topDown: 'Từ trên xuống',
    resetViewTip: 'Đặt lại góc quay mặc định',
    rotationRingsLabel: 'Vòng quay:',
    freeOrbit3D: 'Xoay 3D tự do',
    clickSelect3D: 'Click chọn trục',
    needleDensityLabel: 'Mật độ kim:',
    fiberDensityLabel: 'Mật độ xơ:',
    supplyRollLabel: 'Cây vải:',
    suctionOffsetLabel: 'Độ sâu luồng hút:',
    suctionWidthLabelShort: 'Rộng:',
    hudShortcutNotice: 'Hiện thông số (HUD) [Phím H]',
    physicalSimLabel: 'Mô phỏng vật lý:',
    fiberTuftsCount: 'cụm bông',
    fiberParticlesCount: 'hạt xơ tơi',

    gapCalibratorTitle: 'Căn Chỉnh Cự Ly Khe Hở Chính Xác',
    gapCalibratorSubtitle: 'Thiết lập khe hở milimet chuẩn giữa trục xé, dao cắt và trục chải',
    stationaryRoller: 'Chi tiết cố định (Giữ nguyên vị trí):',
    movingRoller: 'Chi tiết di chuyển:',
    targetGapMm: 'Khe hở mục tiêu (mm):',
    currentCalculatedGap: 'Khe hở hiện tại:',
    centerDistance: 'Khoảng cách tâm:',
    recommendedGaps: 'Khuyến nghị cự ly chuẩn nhanh:',
    applyGapBtn: 'Áp dụng cự ly chuẩn',

    cardClothingTitle: 'Giải Phẫu & Phóng Đại Vi Mô Đồ Kim Cào Xé',
    cardClothingSubtitle: 'Chi tiết hình học răng cưa, góc nghiêng lưỡi cắt và mật độ kim dệt',
    realMacroPhotoTab: 'Ảnh Chụp Macro Thực Tế',
    diagram2DTab: 'Sơ Đồ Kỹ Thuật CAD',
    wireTypeLabel: 'Kiểu đồ kim & ghim cào:',
    standardCatalogTitle: 'Tiêu chuẩn kỹ thuật đồ kim công nghiệp:',
    applyPresetCardBtn: 'Áp dụng thông số đồ kim',

    exportModalTitle: 'Xuất Báo Cáo Kỹ Thuật & Cấu Hình Máy',
    exportModalSubtitle: 'Tải về cấu hình JSON hoặc sao chép báo cáo kiểm tra an toàn vận hành',
    reportTab: 'Báo Cáo Kỹ Thuật Văn Bản',
    jsonTab: 'Dữ Liệu JSON Cấu Hình',
    copyReportBtn: 'Sao chép báo cáo',
    copiedSuccess: 'Đã sao chép vào Clipboard!',
    downloadReportBtn: 'Tải tệp .txt',
    downloadJsonBtn: 'Tải tệp .json',

    savedModalTitle: 'Quản Lý Cấu Hình & Bản Thiết Kế Dàn Máy',
    savedModalSubtitle: 'Lưu trữ các mẫu máy tự chế tạo, xuất nhập file JSON và chia sẻ',
    saveNewConfigTitle: 'Lưu Dàn Máy Hiện Tại Về Bộ Nhớ',
    configNamePlaceholder: 'Nhập tên dàn máy (ví dụ: Dàn xé denim 3 trống cải tiến)...',
    notesPlaceholder: 'Ghi chú kỹ thuật (khe hở dao, tốc độ biến tần, loại vải)...',
    saveCurrentBtn: 'Lưu cấu hình này',
    importJsonBtn: 'Nhập từ file JSON',
    exportAllJsonBtn: 'Sao lưu toàn bộ JSON',
    savedListTitle: 'Danh Sách Dàn Máy Đã Lưu:',
    loadConfigBtn: 'Tải dàn máy này',
    confirmDeleteConfig: 'Bạn có chắc chắn muốn xóa bản lưu này?',

    openTabModalTitle: 'Mở Ứng Dụng Sang Tab Mới Độc Lập',
    openTabModalSubtitle: 'Trải nghiệm toàn màn hình mượt mà không bị giới hạn bởi iframe nhúng',
    openTabDesc: 'Mở ứng dụng sang tab trình duyệt mới giúp tận dụng tối đa không gian màn hình rộng, tối ưu hiệu năng card đồ họa 3D WebGL và bản vẽ 2D CAD.',
    copyLinkBtn: 'Sao chép đường link',
    openDirectTabBtn: 'Mở tab mới ngay bây giờ ↗',

    rollerMainDrum: 'Trống Xé Chính (Main Cylinder)',
    rollerFeed: 'Trục Ép Cấp Liệu (Feed Roller)',
    rollerWorker: 'Trục Chải (Worker Roller)',
    rollerStripper: 'Trục Bóc (Stripper Roller)',
    rollerKnife: 'Dao Cắt Tĩnh (Fixed Knife)',
    rollerSuction: 'Miệng Hút Gom Bông (Suction)',
    rollerCondenser: 'Trống Ngưng Kết (Condenser)',

    surfaceWireTeeth: 'Gai xé thép / Răng cưa nhọn (Wire Teeth)',
    surfaceFlutedSteel: 'Khía rãnh thép kẹp chặt (Fluted Steel)',
    surfaceSmoothRubber: 'Bọc cao su ép áp lực (Smooth Rubber)',
    surfaceBlade: 'Lưỡi hợp kim dao cắt tĩnh (Alloy Blade)',
    surfaceMeshPerforated: 'Lưới inox đục lỗ hút gió (Perforated Mesh)',
  },

  en: {
    appTitle: 'TexTear 3D - Industrial Textile Tearing Machine Simulation',
    appDescription: '3D/2D textile tearing machine simulation, cylinder & roller configuration, cutter blades, millimeter gap calibration, rotation conflict detection, real-time tension dynamics, and fiber suction filtration.',
    brandSub: 'Textile Opening & Tearing Simulator',

    navMachine: 'Machine Model',
    navKinematics: 'Kinematics',
    navClearance: 'Gap Clearances',
    navDiagnostics: 'Diagnostics',
    navSuction: 'Suction System',
    openNewTab: 'Open New Tab ↗',
    exportConfig: 'Export Machine Specs',

    play: 'Play',
    pause: 'Pause',
    speed: 'Speed',
    undo: 'Undo',
    redo: 'Redo',
    undoToast: '↶ Action undone',
    redoToast: '↷ Action redone',
    locked: 'LOCKED',
    lockPosition: 'Lock Position',
    lockedTip: 'Machine positions are LOCKED. Click to UNLOCK for moving and dragging.',
    unlockedTip: 'Click to LOCK all roller positions on CAD & 3D to avoid accidental dragging.',
    view3D: '3D View',
    view2D: '2D CAD',
    viewSplit: 'Split View',
    grid: 'Grid:',
    gridStandard: '10 mm (Standard)',
    gridFine: '1 mm (Fine)',
    gridOff: 'Off (Free)',
    hud: 'HUD [H]',
    hudShow: 'Show [H]',
    cardClothing: 'Card Clothing',
    gapsMm: 'Gaps (mm)',
    newTab: 'New Tab ↗',
    fullscreen: 'Fullscreen View',
    minimize: 'Exit Fullscreen',
    toggleSidebar: 'Inspector Panel',
    apply: 'Apply',
    cancel: 'Cancel',
    delete: 'Delete',
    save: 'Save',
    saved: 'Saved',
    saveModel: 'Save Model *',
    savedToast: '✓ Machine setup saved successfully',
    createdToast: '+ New blank machine created. Design your layout and click "Save Model"!',
    renamedToast: '✓ Model renamed successfully',
    duplicatedToast: '📋 Model duplicated successfully',
    deletedToast: '🗑️ Machine configuration deleted',
    loadedToast: '⚡ Configuration loaded',
    loadedStandardToast: '⚡ Standard preset loaded',

    newModelBtn: '+ New Model',
    newModelTitle: '+ Create Blank Machine',
    newModelDesc: 'Freely build and arrange custom roller configurations',
    modelSelectorTitle: 'MACHINE MODEL SELECTOR',
    yourSavedModels: 'Your Saved Models',
    factoryPresets: 'Factory Standard Presets',
    quickActions: 'Quick Actions',
    createNewModelOption: '+ Create New Machine...',
    fullManagementOption: '📁 Manage Models & JSON Export...',
    noSavedModels: 'No custom configurations saved yet. Customize your machine and click Save Model!',
    activeBadge: 'Active',
    itemsCount: 'rollers',
    addRollerBtn: 'Add Roller',
    addRollerMenuTitle: 'Select component to add to machine',

    fabricWidthLabel: 'Fabric Width:',
    fabricControllerTitle: 'FABRIC WIDTH & MATERIAL CONTROLLER',
    feedWidth: 'Feed Fabric Width:',
    fabricLayers: 'Fabric Layers:',
    layersUnit: 'layers',
    feedSpeed: 'Feed Speed:',
    speedUnitMPerMin: 'm/min',
    fabricColor3D: '3D Fabric Web Color:',
    supplyRollStand: 'Fabric Supply Roll Stand:',
    showText: 'SHOW',
    hideText: 'HIDE',
    fabricWidthNotice: '* Supports up to 2000mm width (heavy industrial textile opening standard). Cylinders auto-expand to match fabric width.',

    colorDenim: 'Denim Blue',
    colorCotton: 'Cotton White',
    colorBleached: 'Bleached Grey',
    colorRed: 'Red',
    colorGreen: 'Green',

    tabRollerGap: 'Rollers & Gaps',
    tabFabricPath: 'Fabric & Path',
    tabDiagnostics: 'Diagnostics',
    tabTensionAir: 'Tension & Air',
    openSettingsBtn: 'Open Inspector',

    noRollerSelectedTitle: 'No Roller or Component Selected',
    noRollerSelectedDesc: 'Click on any cylinder, feed roller, or knife in the 2D CAD or 3D view to inspect and adjust technical specifications.',
    rollerCoordX: 'Coordinate X',
    rollerCoordY: 'Coordinate Y',
    rollerDiameter: 'Diameter Ø',
    rollerLength: 'Roller Length L',
    rollerRpm: 'Rotational Speed:',
    rollerFreqHz: 'VFD Inverter Frequency:',
    rollerLinearSpeed: 'Surface Speed:',
    rotationDir: 'Rotation Direction:',
    dirCW: '↻ CW (Clockwise)',
    dirCCW: '↺ CCW (Counter-Clockwise)',
    dirStatic: 'Static (0 RPM)',
    surfaceType: 'Working Surface Type:',
    cardClothingSpecs: 'Card Clothing Tooth Geometry:',
    toothPitch: 'Tooth Pitch p',
    toothHeight: 'Tooth Height H',
    toothAngle: 'Rake Angle',
    techFunction: 'Technological Function:',
    enterGap: 'Set Gap:',
    applyGap: 'Apply',
    duplicateRoller: 'Duplicate Component',
    deleteRoller: 'Delete Component',
    cardingWrapGapOption: 'Pass through carding gap (Between worker & drum)',
    openCardClothingDetail: 'Open Card Clothing Anatomy & Standards',
    autoShiftNotice: 'Auto-adjusts position',
    gapToOther: 'Clearance to',

    routingPanelTitle: 'FABRIC ROUTING & TEARING OUTPUT',
    outputSummaryTitle: 'Actual Tearing Output:',
    kgPerHour: 'Kg/Hour',
    kgPerShift: 'Kg/Shift (8h)',
    mPerHour: 'm/hour',
    feedDirectionLabel: 'Fabric intake direction into machine:',
    leftToRight: 'Left ➔ Right (Standard)',
    rightToLeft: 'Right ➔ Left (Reverse)',
    tuftParticlesLabel: 'Fiber Tuft Particle Ejection:',
    contactSequenceTitle: 'Fabric Contact Sequence:',
    wrapUnder: 'Wrap Underneath',
    wrapOver: 'Wrap Over Top',
    tangentContact: 'Tangent Contact',
    cardingGapContact: 'Carding Gap (Between Rollers)',

    materialFlowTitle: 'Raw Material Feed Flow (Rags/Cotton)',
    materialTypeLabel: 'Material Type & Name:',
    materialDenim: 'Denim Garment Waste (Durable)',
    materialCottonKnit: 'Cotton Knit Rags (Soft)',
    materialPoly: 'Synthetic Polyester Fiber',
    materialBlended: 'Blended Garment Waste',
    basisWeightLabel: 'Basis Weight (GSM):',
    nominalTensionLabel: 'Nominal Intake Tension (N):',
    tensionMonitorTitle: 'Tension & Draft Ratio Monitoring',
    tensionSegment: 'Roller Segment',
    tensionDraftRatio: 'Draft Ratio v2/v1',
    tensionForce: 'Tension',
    tensionStatus: 'Status',
    suctionSystemTitle: 'Centrifugal Dust & Fiber Suction System',
    suctionFanStatus: 'Suction fan status:',
    airflowRateLabel: 'Airflow Rate (m³/h):',
    airVelocityLabel: 'Air Velocity at Hood (m/s):',
    filterPressureLabel: 'Filter Diff Pressure (Pa):',
    ductDiameterLabel: 'Duct Diameter (mm):',

    dangerConflicts: 'Critical Conflicts',
    techWarnings: 'Technical Warnings',
    optimizations: 'Optimization Tips',
    diagnosticEngineTitle: 'Automated Engineering Diagnostics',
    realtimeLabel: 'Real-Time',
    systemOptimalTitle: 'System Operating Optimally',
    systemOptimalDesc: 'No rotation conflicts, no mechanical collisions. Fabric web tension and suction airflow are within optimal engineering tolerances.',
    autoFixBtn: 'Auto-Fix This Issue',
    calibrateGapBtn: 'Calibrate Gap Clearance',
    gapMatrixTitle: 'Inter-Roller Gap Clearances',

    statusCollision: 'Mechanical Collision',
    statusTooTight: 'Clearance Too Tight',
    statusTooWide: 'Clearance Too Wide',
    statusOptimal: 'Optimal',
    statusCriticalSnap: 'Fabric Snap Risk',
    statusSlackWrap: 'Slack / Roller Wrap Risk',
    statusWarningHigh: 'High Tension',

    scaleLabel: 'Scale:',
    gridLabel: 'Grid:',
    freePanMode: 'Free Pan View',
    dragSelectMode: 'Select & Drag Roller',
    suctionPathLabel: 'Suction Duct:',
    suctionWidthLabel: 'Width:',
    narrowSuctionTip: 'Narrow suction duct',
    expandSuctionTip: 'Expand suction duct under rollers',
    zoomInTip: 'Zoom in',
    zoomOutTip: 'Zoom out',
    fitViewTip: 'Fit view to screen',
    noAdjacentRollers: 'No adjacent components < 120mm',

    perspective3D: '3D Perspective',
    frontCutaway: 'Side Cutaway',
    topDown: 'Top-Down View',
    resetViewTip: 'Reset camera view',
    rotationRingsLabel: 'Rotation Rings:',
    freeOrbit3D: 'Free 3D Orbit',
    clickSelect3D: 'Click to Select',
    needleDensityLabel: 'Wire Density:',
    fiberDensityLabel: 'Fiber Density:',
    supplyRollLabel: 'Supply Roll:',
    suctionOffsetLabel: 'Suction Duct Depth:',
    suctionWidthLabelShort: 'Width:',
    hudShortcutNotice: 'Show HUD [Key H]',
    physicalSimLabel: 'Physics simulation:',
    fiberTuftsCount: 'tufts',
    fiberParticlesCount: 'free fibers',

    gapCalibratorTitle: 'Precision Gap & Clearance Calibrator',
    gapCalibratorSubtitle: 'Set exact millimeter clearance between opening cylinders, knives, and worker rollers',
    stationaryRoller: 'Stationary Reference Component (Keeps position):',
    movingRoller: 'Adjustable Moving Component:',
    targetGapMm: 'Target Clearance Gap (mm):',
    currentCalculatedGap: 'Current Gap:',
    centerDistance: 'Center Distance:',
    recommendedGaps: 'Quick Recommended Presets:',
    applyGapBtn: 'Apply Precision Gap',

    cardClothingTitle: 'Card Clothing & Sawtooth Wire Micro-Anatomy',
    cardClothingSubtitle: 'Geometric tooth profiles, rake angles, tooth pitch, and needle population densities',
    realMacroPhotoTab: 'Actual Macro Photography',
    diagram2DTab: 'Technical CAD Profile',
    wireTypeLabel: 'Card clothing & lag type:',
    standardCatalogTitle: 'Industrial Wire Clothing Specifications:',
    applyPresetCardBtn: 'Apply Clothing Specs',

    exportModalTitle: 'Export Technical Report & Machine Specs',
    exportModalSubtitle: 'Download machine configuration in JSON or copy engineering safety inspection report',
    reportTab: 'Technical Engineering Report',
    jsonTab: 'JSON Machine Data',
    copyReportBtn: 'Copy Report',
    copiedSuccess: 'Copied to Clipboard!',
    downloadReportBtn: 'Download .txt Report',
    downloadJsonBtn: 'Download .json',

    savedModalTitle: 'Machine Configuration & Preset Manager',
    savedModalSubtitle: 'Store custom machine designs, import/export JSON backups, and reload configurations',
    saveNewConfigTitle: 'Save Current Machine Configuration',
    configNamePlaceholder: 'Enter machine name (e.g., Heavy Denim 3-Cylinder Opener v2)...',
    notesPlaceholder: 'Technical notes (knife gap, VFD frequencies, fabric blend)...',
    saveCurrentBtn: 'Save Configuration',
    importJsonBtn: 'Import JSON File',
    exportAllJsonBtn: 'Export All (Backup JSON)',
    savedListTitle: 'Saved Configurations Library:',
    loadConfigBtn: 'Load This Configuration',
    confirmDeleteConfig: 'Are you sure you want to delete this configuration?',

    openTabModalTitle: 'Open Application in Dedicated Tab',
    openTabModalSubtitle: 'Enjoy unrestricted full-screen viewport experience outside iframe embedding',
    openTabDesc: 'Opening in a dedicated browser tab provides maximum workspace resolution, full GPU hardware acceleration for 3D Three.js rendering, and unhindered 2D CAD navigation.',
    copyLinkBtn: 'Copy Direct Link',
    openDirectTabBtn: 'Open in New Tab Now ↗',

    rollerMainDrum: 'Main Opening Cylinder',
    rollerFeed: 'Feed Nip Roller',
    rollerWorker: 'Worker Roller',
    rollerStripper: 'Stripper Roller',
    rollerKnife: 'Fixed Bed Knife',
    rollerSuction: 'Exhaust Suction Hood',
    rollerCondenser: 'Condenser Screen Drum',

    surfaceWireTeeth: 'Metallic Sawtooth Wire Teeth',
    surfaceFlutedSteel: 'Fluted Steel Grip Rollers',
    surfaceSmoothRubber: 'Smooth High-Pressure Rubber',
    surfaceBlade: 'Alloy Fixed Knife Blade',
    surfaceMeshPerforated: 'Perforated Stainless Screen',
  },
};
