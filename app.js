(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const STORAGE = {
    archives: 'qixiang.archives.v1',
    current: 'qixiang.current.v1',
    settings: 'qixiang.settings.v1',
    timer: 'qixiang.timer.v1'
  };

  const MODE_LABELS = {
    emoji: 'emoji 单独',
    scene: '场景图单独',
    mixed: '混合模式'
  };

  const EMOJI_BASE = [
    ['🦊', '狐狸'], ['🐼', '熊猫'], ['🐰', '兔子'], ['🐯', '老虎'], ['🦁', '狮子'],
    ['🐸', '青蛙'], ['🐙', '章鱼'], ['🦋', '蝴蝶'], ['🐢', '乌龟'], ['🐳', '鲸鱼'],
    ['🦄', '独角兽'], ['🐉', '小龙'], ['🦖', '恐龙'], ['🐧', '企鹅'], ['🐝', '蜜蜂'],
    ['🐌', '蜗牛'], ['🦉', '猫头鹰'], ['🐿️', '松鼠'], ['🦔', '刺猬'], ['🐠', '小鱼'],
    ['🦀', '螃蟹'], ['🐞', '瓢虫'], ['🐘', '大象'], ['🐒', '猴子'], ['🌳', '大树'],
    ['🌵', '仙人掌'], ['🍄', '蘑菇'], ['🌈', '彩虹'], ['☁️', '云朵'], ['⭐', '星星'],
    ['🌙', '月亮'], ['☀️', '太阳'], ['🌻', '向日葵'], ['🍎', '苹果'], ['🍓', '草莓'],
    ['🍉', '西瓜'], ['🎈', '气球'], ['🎨', '调色盘'], ['🎸', '吉他'], ['🚀', '火箭'],
    ['✈️', '飞机'], ['🚲', '自行车'], ['🏠', '小屋'], ['🏰', '城堡'], ['⛵', '帆船'],
    ['🛸', '飞碟'], ['🔮', '水晶球'], ['🧸', '玩具熊'], ['🪁', '风筝'], ['🎁', '礼物'],
    ['🪐', '行星'], ['🌋', '火山'], ['🏝️', '小岛'], ['🍦', '冰淇淋'], ['🎪', '马戏帐篷']
  ];

  const EMOJI_FEATURES = {
    '狐狸': { shape: '尖耳朵和蓬松大尾巴', detail: '橙色毛发与白色胸口', action: '轻巧潜行' },
    '熊猫': { shape: '圆滚滚的身体和黑眼圈', detail: '黑白毛色分界', action: '慢吞吞地啃竹子' },
    '兔子': { shape: '长耳朵和圆尾巴', detail: '柔软白毛', action: '蹦跳' },
    '老虎': { shape: '强壮身体和长尾巴', detail: '橙色条纹', action: '悄声踱步' },
    '狮子': { shape: '蓬松鬃毛和宽脸', detail: '金色皮毛', action: '威严咆哮' },
    '青蛙': { shape: '大眼睛和宽嘴巴', detail: '湿亮的绿色皮肤', action: '弹跳' },
    '章鱼': { shape: '八条卷曲触手', detail: '吸盘纹理', action: '喷墨躲藏' },
    '蝴蝶': { shape: '对称大翅膀', detail: '斑斓鳞粉', action: '轻轻振翅' },
    '乌龟': { shape: '圆拱硬壳和短腿', detail: '六边形龟甲纹理', action: '缓慢爬行' },
    '鲸鱼': { shape: '巨大纺锤形身体', detail: '蓝灰色皮肤', action: '喷出水柱' },
    '独角兽': { shape: '螺旋独角和飘逸鬃毛', detail: '彩虹光泽', action: '昂首奔跑' },
    '小龙': { shape: '蛇形长身和分叉角', detail: '闪亮鳞片', action: '盘旋' },
    '恐龙': { shape: '粗壮后腿和长尾', detail: '粗糙皮肤', action: '沉重踏步' },
    '企鹅': { shape: '圆胖身体和短翅膀', detail: '黑白分界', action: '摇摆走路' },
    '蜜蜂': { shape: '黄黑条纹和透明翅膀', detail: '毛茸茸的身体', action: '嗡嗡飞行' },
    '蜗牛': { shape: '螺旋壳和柔软身体', detail: '湿润黏液光', action: '缓慢滑行' },
    '猫头鹰': { shape: '大圆眼和兜帽状羽毛', detail: '斑点羽毛', action: '无声转头' },
    '松鼠': { shape: '蓬松大尾巴和尖耳朵', detail: '棕色绒毛', action: '快速攀爬' },
    '刺猬': { shape: '圆背和尖刺', detail: '棕色刺与浅色肚皮', action: '缩成一团' },
    '小鱼': { shape: '流线身体和扇形尾巴', detail: '闪亮鳞片', action: '摆尾游动' },
    '螃蟹': { shape: '横宽身体和大螯', detail: '坚硬甲壳', action: '横着走' },
    '瓢虫': { shape: '半圆背壳和圆点', detail: '红黑图纹', action: '短距离飞行' },
    '大象': { shape: '长鼻子和大耳朵', detail: '灰色厚皮', action: '喷水' },
    '猴子': { shape: '长手臂和卷尾巴', detail: '毛茸茸的身体', action: '倒挂攀爬' },
    '大树': { shape: '粗壮树干和层层树冠', detail: '树皮纹理', action: '枝叶摇晃' },
    '仙人掌': { shape: '高柱状身体和尖刺', detail: '绿色肉质感', action: '在干旱中站立' },
    '蘑菇': { shape: '圆伞菌盖和短柄', detail: '斑点花纹', action: '快速生长' },
    '彩虹': { shape: '多层弧形', detail: '渐变色彩', action: '雨后天晴出现' },
    '云朵': { shape: '蓬松轮廓', detail: '柔软白色', action: '漂浮变形' },
    '星星': { shape: '五角轮廓', detail: '明亮光芒', action: '闪烁' },
    '月亮': { shape: '弯钩形状', detail: '银白表面', action: '在夜晚升起' },
    '太阳': { shape: '圆形本体和放射光', detail: '金黄暖色', action: '升起照耀' },
    '向日葵': { shape: '花盘和细长花瓣', detail: '深色花心与黄色花瓣', action: '跟随阳光' },
    '苹果': { shape: '圆润果形和细柄', detail: '红亮果皮', action: '从树上掉落' },
    '草莓': { shape: '心形果实和种子点', detail: '红色表面', action: '成熟散发香气' },
    '西瓜': { shape: '圆球和藤蔓', detail: '绿皮红瓤黑籽', action: '被切开' },
    '气球': { shape: '椭圆球体与细线', detail: '光滑乳胶', action: '飘升' },
    '调色盘': { shape: '月牙形托盘和颜料点', detail: '混合色块', action: '被画笔涂抹' },
    '吉他': { shape: '葫芦形琴身和长琴颈', detail: '木纹与琴弦', action: '被拨响' },
    '火箭': { shape: '尖头圆柱和尾翼', detail: '金属外壳', action: '点火升空' },
    '飞机': { shape: '修长机身和展开机翼', detail: '银色蒙皮', action: '滑行起飞' },
    '自行车': { shape: '两个轮子和三角形车架', detail: '金属辐条', action: '滚动前进' },
    '小屋': { shape: '斜屋顶和方形门窗', detail: '瓦片与木板', action: '窗口亮起灯光' },
    '城堡': { shape: '高塔和城墙齿', detail: '石砖纹理', action: '矗立守门' },
    '帆船': { shape: '弧形船身和鼓起的帆', detail: '木纹与布面', action: '顺风航行' },
    '飞碟': { shape: '扁圆盘和穹顶', detail: '金属反光', action: '悬停旋转' },
    '水晶球': { shape: '透明球体和底座', detail: '玻璃反光', action: '内部起雾发光' },
    '玩具熊': { shape: '圆耳朵和缝线四肢', detail: '毛绒表面', action: '被抱紧' },
    '风筝': { shape: '菱形骨架和长尾巴', detail: '薄纸与布料', action: '迎风摆动' },
    '礼物': { shape: '方形盒子和蝴蝶结', detail: '包装纸纹理', action: '被拆开' },
    '行星': { shape: '球形星体和光环', detail: '岩石与气体表面', action: '缓慢旋转' },
    '火山': { shape: '锥形山体和火山口', detail: '黑色岩石与橙红岩浆', action: '喷发' },
    '小岛': { shape: '隆起沙地和棕榈树', detail: '沙粒与海水边缘', action: '被浪包围' },
    '冰淇淋': { shape: '螺旋球体和脆筒', detail: '奶油质感', action: '融化' },
    '马戏帐篷': { shape: '条纹圆顶帐篷', detail: '帆布纹理', action: '灯光亮起' }
  };

  const EMOJI_POOL = EMOJI_BASE.map(([char, name]) => ({
    char,
    name,
    ...(EMOJI_FEATURES[name] || { shape: '最醒目的外形', detail: '独特纹理', action: '最典型动作' })
  }));

  const STYLES = [
    '纸雕拼贴', '蜡笔童画', '水彩淡彩', '厚涂绘本', '木刻版画', '彩铅细描',
    '剪纸风', '黏土定格感', '霓虹夜色', '复古海报', '点彩画', '漫画分镜感',
    '柔光数字绘', '立体绘本', '铅笔速写加淡彩', '几何色块插画'
  ];

  const COMPOSITIONS = [
    '低视角，让主体显得更大', '大面积留白，主体偏右', '前景物体半遮挡画面',
    '圆形框式构图', '对角线引导视线', '俯视桌面式构图', '近距离特写',
    '三联画式节奏', '窗框取景', 'S 形路径贯穿画面', '高机位俯拍',
    '小小主体置于大空间', '多层前后景叠放', '主体紧贴一侧边缘'
  ];

  const PALETTES = [
    { name: '草莓汽水', colors: ['#F45B69', '#FFD166', '#FFEFE8', '#51C4B7', '#2B3A55'] },
    { name: '森林野餐', colors: ['#315C45', '#7BAA6B', '#DDE8B9', '#F2C14E', '#F7F1E3'] },
    { name: '蓝莓月光', colors: ['#1E2A5A', '#5865B8', '#8FB8DE', '#F4D06F', '#FAF3E0'] },
    { name: '橘子日落', colors: ['#E76F51', '#F4A261', '#E9C46A', '#2A9D8F', '#264653'] },
    { name: '糖果纸片', colors: ['#EF476F', '#FFD166', '#06D6A0', '#118AB2', '#073B4C'] },
    { name: '小小花园', colors: ['#8ECAE6', '#219EBC', '#FFB703', '#FB8500', '#FDF0D5'] },
    { name: '薄荷奶油', colors: ['#A8DADC', '#F1FAEE', '#FFB4A2', '#E5989B', '#6D6875'] },
    { name: '宇宙果冻', colors: ['#231942', '#5E548E', '#9F86C0', '#E0B1CB', '#FFF1E6'] },
    { name: '柠檬苏打', colors: ['#FFF3B0', '#F9DC5C', '#B5E48C', '#52B69A', '#184E77'] },
    { name: '雨天玻璃', colors: ['#DCEAF1', '#8FB9C4', '#4A7C89', '#F2C14E', '#334155'] },
    { name: '桃子乌龙', colors: ['#FFCDB2', '#FFB4A2', '#E5989B', '#B5838D', '#6D6875'] },
    { name: '草地风筝', colors: ['#A7C957', '#F2E8CF', '#386641', '#BC4749', '#F2CC8F'] }
  ];

  const ui = {
    lessonDate: $('#lessonDate'),
    archiveCount: $('#archiveCount'),
    storagePill: $('#storagePill'),
    modeButtons: $$('.mode-button'),
    emojiArea: $('#emojiArea'),
    emojiGrid: $('#emojiGrid'),
    sceneArea: $('#sceneArea'),
    sceneFrame: $('#sceneFrame'),
    sceneEmpty: $('#sceneEmpty'),
    sceneImage: $('#sceneImage'),
    sceneName: $('#sceneName'),
    rollSceneBtn: $('#rollSceneBtn'),
    sceneUploadInput: $('#sceneUploadInput'),
    toggleGalleryBtn: $('#toggleGalleryBtn'),
    galleryPanel: $('#galleryPanel'),
    galleryGrid: $('#galleryGrid'),
    sceneCountLabel: $('#sceneCountLabel'),
    aiDrawer: $('#aiDrawer'),
    generateAiBtn: $('#generateAiBtn'),
    refreshAiBtn: $('#refreshAiBtn'),
    aiStatus: $('#aiStatus'),
    aiIdeas: $('#aiIdeas'),
    aiEndpoint: $('#aiEndpoint'),
    aiModel: $('#aiModel'),
    aiKey: $('#aiKey'),
    saveAiSettingsBtn: $('#saveAiSettingsBtn'),
    styleValue: $('#styleValue'),
    compositionValue: $('#compositionValue'),
    paletteName: $('#paletteName'),
    paletteSwatches: $('#paletteSwatches'),
    timerDisplay: $('#timerDisplay'),
    timerState: $('#timerState'),
    timerToggleBtn: $('#timerToggleBtn'),
    timerResetBtn: $('#timerResetBtn'),
    customMinutes: $('#customMinutes'),
    studentWorkInput: $('#studentWorkInput'),
    studentGrid: $('#studentGrid'),
    teacherNotes: $('#teacherNotes'),
    summaryPreview: $('#summaryPreview'),
    copySummaryBtn: $('#copySummaryBtn'),
    saveArchiveBtn: $('#saveArchiveBtn'),
    resetRoundBtn: $('#resetRoundBtn'),
    archiveList: $('#archiveList'),
    exportArchivesBtn: $('#exportArchivesBtn'),
    importArchivesInput: $('#importArchivesInput'),
    importBar: $('#importBar'),
    importPreviewText: $('#importPreviewText'),
    mergeImportBtn: $('#mergeImportBtn'),
    replaceImportBtn: $('#replaceImportBtn'),
    cancelImportBtn: $('#cancelImportBtn'),
    toast: $('#toast')
  };

  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      console.warn('读取本地数据失败', key, error);
      return fallback;
    }
  }

  function writeJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('写入本地数据失败', key, error);
      toast('浏览器本地空间可能已满，请先导出课程档案并清理部分图片。', true);
      return false;
    }
  }

  function localDateString(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
  }

  function formatDate(value) {
    if (!value) return '未填写日期';
    const [year, month, day] = value.split('-').map(Number);
    if (!year || !month || !day) return value;
    return year + '年' + month + '月' + day + '日';
  }

  function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[char]));
  }

  function randomItem(items, exclude) {
    const available = items.filter(item => item !== exclude);
    const pool = available.length ? available : items;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function makeId(prefix) {
    const random = globalThis.crypto?.randomUUID?.() || (Date.now().toString(36) + Math.random().toString(36).slice(2));
    return prefix + '_' + random;
  }

  const savedCurrent = readJSON(STORAGE.current, {});
  const savedSettings = readJSON(STORAGE.settings, {});
  const savedTimer = readJSON(STORAGE.timer, {});

  const state = {
    mode: MODE_LABELS[savedCurrent.mode] ? savedCurrent.mode : 'emoji',
    lessonDate: savedCurrent.lessonDate || localDateString(),
    emojis: Array.isArray(savedCurrent.emojis)
      ? savedCurrent.emojis.filter(item => item && item.char).slice(0, 3).map(item => EMOJI_POOL.find(poolItem => poolItem.char === item.char) || item)
      : [],
    currentScene: savedCurrent.currentScene?.id ? savedCurrent.currentScene : null,
    style: savedCurrent.style || '',
    composition: savedCurrent.composition || '',
    palette: savedCurrent.palette || null,
    aiIdeas: Array.isArray(savedCurrent.aiIdeas) ? savedCurrent.aiIdeas.slice(0, 3) : [],
    notes: savedCurrent.notes || '',
    currentWorks: Array.isArray(savedCurrent.currentWorks) ? savedCurrent.currentWorks : [],
    gallery: [],
    archives: readJSON(STORAGE.archives, []),
    expandedArchives: new Set(),
    aiLoading: false,
    pendingImport: null,
    timer: {
      duration: Math.max(60, Number(savedTimer.duration) || 20 * 60),
      remaining: Math.max(0, Number(savedTimer.remaining) || 20 * 60),
      endAt: savedTimer.running ? Number(savedTimer.endAt) || 0 : 0,
      running: Boolean(savedTimer.running),
      finished: Boolean(savedTimer.finished)
    }
  };

  if (!Array.isArray(state.archives)) state.archives = [];

  const settings = {
    endpoint: savedSettings.endpoint || '',
    model: savedSettings.model || '',
    apiKey: savedSettings.apiKey || ''
  };

  let toastTimer = null;
  function toast(message, isError = false) {
    window.clearTimeout(toastTimer);
    ui.toast.textContent = message;
    ui.toast.classList.toggle('is-error', isError);
    ui.toast.classList.add('is-visible');
    toastTimer = window.setTimeout(() => ui.toast.classList.remove('is-visible'), 3500);
  }

  function saveCurrentState() {
    writeJSON(STORAGE.current, {
      mode: state.mode,
      lessonDate: state.lessonDate,
      emojis: state.emojis,
      currentScene: state.currentScene ? { id: state.currentScene.id, name: state.currentScene.name } : null,
      style: state.style,
      composition: state.composition,
      palette: state.palette,
      aiIdeas: state.aiIdeas,
      notes: ui.teacherNotes?.value ?? state.notes,
      currentWorks: state.currentWorks,
      updatedAt: new Date().toISOString()
    });
  }

  let dbPromise = null;
  function openDatabase() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open('qixiang-canvas', 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('images')) {
          const store = db.createObjectStore('images', { keyPath: 'id' });
          store.createIndex('kind', 'kind', { unique: false });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    return dbPromise;
  }

  async function dbPutImage(record) {
    const db = await openDatabase();
    await new Promise((resolve, reject) => {
      const transaction = db.transaction('images', 'readwrite');
      transaction.objectStore('images').put(record);
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  }

  async function dbGetImage(id) {
    if (!id) return null;
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const request = db.transaction('images', 'readonly').objectStore('images').get(id);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async function dbGetImagesByKind(kind) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const index = db.transaction('images', 'readonly').objectStore('images').index('kind');
      const request = index.getAll(kind);
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async function dbDeleteImage(id) {
    if (!id) return;
    const db = await openDatabase();
    await new Promise((resolve, reject) => {
      const transaction = db.transaction('images', 'readwrite');
      transaction.objectStore('images').delete(id);
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
    });
    imageUrlCache.delete(id);
  }

  async function dbDeleteImagesByKind(kind) {
    const items = await dbGetImagesByKind(kind);
    await Promise.all(items.map(item => dbDeleteImage(item.id)));
  }

  async function dbClearArchiveImages() {
    await dbDeleteImagesByKind('archive-scene');
    await dbDeleteImagesByKind('student-work');
  }

  const imageUrlCache = new Map();
  function blobToDataURL(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  }

  async function dataURLToBlob(dataURL) {
    const response = await fetch(dataURL);
    if (!response.ok) throw new Error('图片数据无法读取');
    return response.blob();
  }

  async function imageDataURL(id) {
    if (!id) return '';
    if (imageUrlCache.has(id)) return imageUrlCache.get(id);
    const record = await dbGetImage(id);
    if (!record?.blob) return '';
    const dataURL = await blobToDataURL(record.blob);
    imageUrlCache.set(id, dataURL);
    return dataURL;
  }

  function loadImageElement(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('图片无法解码'));
      image.src = src;
    });
  }

  async function compressImageFile(file, maxEdge = 1280, quality = .84) {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      throw new Error('仅支持 JPG、PNG 或 WebP 图片');
    }
    if (file.size > 30 * 1024 * 1024) {
      throw new Error('单张图片不能超过 30 MB');
    }
    const objectURL = URL.createObjectURL(file);
    try {
      const image = await loadImageElement(objectURL);
      const scale = Math.min(1, maxEdge / Math.max(image.naturalWidth, image.naturalHeight));
      const width = Math.max(1, Math.round(image.naturalWidth * scale));
      const height = Math.max(1, Math.round(image.naturalHeight * scale));
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext('2d', { alpha: true });
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = 'high';
      context.drawImage(image, 0, 0, width, height);
      let blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', quality));
      if (!blob) blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', quality));
      if (!blob) throw new Error('图片压缩失败');
      return { blob, width, height };
    } finally {
      URL.revokeObjectURL(objectURL);
    }
  }

  async function saveCompressedFile(file, kind, maxEdge, prefix) {
    const compressed = await compressImageFile(file, maxEdge);
    const record = {
      id: makeId(prefix),
      kind,
      name: file.name || '未命名图片',
      createdAt: new Date().toISOString(),
      width: compressed.width,
      height: compressed.height,
      blob: compressed.blob
    };
    await dbPutImage(record);
    return record;
  }

  function usedEmojiChars(exceptIndex = -1) {
    return state.emojis
      .filter((_, index) => index !== exceptIndex)
      .map(item => item?.char)
      .filter(Boolean);
  }

  function drawEmoji(excluded = []) {
    return randomItem(EMOJI_POOL.filter(item => !excluded.includes(item.char)));
  }

  function fillEmojis() {
    while (state.emojis.length < 3) {
      const picked = drawEmoji(usedEmojiChars());
      state.emojis.push(picked);
    }
  }

  function rerollEmoji(index) {
    if (index < 0 || index > 2) return;
    state.emojis[index] = drawEmoji(usedEmojiChars(index));
    state.aiIdeas = [];
    renderEmojiCards();
    renderSummary();
    renderAI();
    saveCurrentState();
    const card = $('.emoji-card[data-index="' + index + '"]', ui.emojiGrid);
    if (card) {
      card.classList.add('is-rerolling');
      window.setTimeout(() => card.classList.remove('is-rerolling'), 360);
    }
  }

  function renderEmojiCards() {
    fillEmojis();
    ui.emojiGrid.innerHTML = state.emojis.map((item, index) =>
      '<button type="button" class="emoji-card" data-index="' + index + '" aria-label="重新抽取第 ' + (index + 1) + ' 个 emoji，当前是' + escapeHTML(item.name) + '">' +
        '<span class="reroll-hint" aria-hidden="true">↻ 单独换</span>' +
        '<span class="emoji-char" aria-hidden="true">' + escapeHTML(item.char) + '</span>' +
        '<span class="emoji-name">' + escapeHTML(item.name) + '</span>' +
      '</button>'
    ).join('');
  }

  function renderPrompts() {
    ui.styleValue.textContent = state.style || '等待抽取';
    ui.compositionValue.textContent = state.composition || '等待抽取';
    ui.paletteName.textContent = state.palette?.name || '等待抽取';
    ui.paletteSwatches.innerHTML = (state.palette?.colors || []).map(color =>
      '<span class="palette-swatch" data-hex="' + escapeHTML(color) + '" style="background:' + escapeHTML(color) + '" title="' + escapeHTML(color) + '"></span>'
    ).join('');
  }

  function renderMode() {
    ui.modeButtons.forEach(button => {
      const active = button.dataset.mode === state.mode;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-selected', String(active));
    });
    ui.emojiArea.hidden = state.mode === 'scene';
    ui.sceneArea.hidden = state.mode === 'emoji';
    ui.aiDrawer.hidden = state.mode !== 'emoji';
    renderScene();
  }

  async function renderScene() {
    const scene = state.currentScene;
    if (!scene?.id) {
      ui.sceneImage.hidden = true;
      ui.sceneImage.removeAttribute('src');
      ui.sceneEmpty.hidden = false;
      ui.sceneName.textContent = state.mode === 'scene'
        ? (state.gallery.length ? '点击“换一张”开始抽取' : '等待导入场景图')
        : '等待抽取';
      return;
    }
    try {
      const dataURL = scene.dataUrl || await imageDataURL(scene.id);
      if (!dataURL) {
        state.currentScene = null;
        ui.sceneImage.hidden = true;
        ui.sceneEmpty.hidden = false;
        ui.sceneName.textContent = '原图片已不在本地';
        return;
      }
      scene.dataUrl = dataURL;
      ui.sceneImage.src = dataURL;
      ui.sceneImage.alt = '随机场景参考：' + (scene.name || '未命名场景');
      ui.sceneImage.hidden = false;
      ui.sceneEmpty.hidden = true;
      ui.sceneName.textContent = scene.name || '未命名场景';
    } catch (error) {
      console.error(error);
      ui.sceneImage.hidden = true;
      ui.sceneEmpty.hidden = false;
      ui.sceneName.textContent = '场景图读取失败';
    }
  }

  async function rollScene(showMessage = true) {
    if (!state.gallery.length) {
      state.currentScene = null;
      renderScene();
      renderSummary();
      saveCurrentState();
      if (showMessage) toast('先导入至少一张场景图片，再随机抽取。', true);
      return;
    }
    const currentId = state.currentScene?.id;
    const candidates = state.gallery.filter(item => item.id !== currentId);
    const picked = randomItem(candidates.length ? candidates : state.gallery);
    state.currentScene = { id: picked.id, name: picked.name, dataUrl: '' };
    await renderScene();
    renderSummary();
    saveCurrentState();
  }

  async function refreshGallery() {
    try {
      const records = await dbGetImagesByKind('scene-gallery');
      state.gallery = records.sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)));
      ui.sceneCountLabel.textContent = state.gallery.length + ' 张';
      if (state.currentScene?.id && !state.gallery.some(item => item.id === state.currentScene.id)) {
        state.currentScene = null;
      }
      if (state.mode !== 'emoji' && !state.currentScene && state.gallery.length) {
        await rollScene(false);
      } else {
        renderScene();
        renderSummary();
      }
      renderGallery();
      saveCurrentState();
    } catch (error) {
      console.error(error);
      toast('场景图库读取失败。', true);
    }
  }

  function renderGallery() {
    if (!state.gallery.length) {
      ui.galleryGrid.innerHTML = '<p class="empty-copy">还没有场景图。导入后，图片会保存在当前浏览器中。</p>';
      return;
    }
    ui.galleryGrid.innerHTML = state.gallery.map(item =>
      '<div class="gallery-item" data-id="' + escapeHTML(item.id) + '">' +
        '<img alt="' + escapeHTML(item.name) + '" data-load-image="' + escapeHTML(item.id) + '">' +
        '<span class="gallery-name">' + escapeHTML(item.name) + '</span>' +
        '<button type="button" class="gallery-delete" data-delete-gallery="' + escapeHTML(item.id) + '" aria-label="删除 ' + escapeHTML(item.name) + '">×</button>' +
      '</div>'
    ).join('');
    $$('[data-load-image]', ui.galleryGrid).forEach(async image => {
      const dataURL = await imageDataURL(image.dataset.loadImage);
      if (dataURL) image.src = dataURL;
    });
  }

  function rollStyle() { state.style = randomItem(STYLES, state.style); }
  function rollComposition() { state.composition = randomItem(COMPOSITIONS, state.composition); }
  function rollPalette() {
    const candidates = PALETTES.filter(item => item.name !== state.palette?.name);
    state.palette = randomItem(candidates.length ? candidates : PALETTES);
  }

  function rollAllPrompts(showMessage = false) {
    rollStyle();
    rollComposition();
    rollPalette();
    renderPrompts();
    renderSummary();
    saveCurrentState();
    if (showMessage) toast('画风、构图和配色都换了一组。');
  }

  function buildSummaryLines() {
    const lines = [];
    lines.push('【今日创作灵感】');
    lines.push('日期：' + formatDate(state.lessonDate));
    lines.push('模式：' + MODE_LABELS[state.mode]);
    if (state.mode !== 'scene') {
      lines.push('emoji：' + state.emojis.map(item => item.char + ' ' + item.name).join('  ·  '));
    }
    if (state.mode !== 'emoji') {
      lines.push('场景参考：' + (state.currentScene?.name || '尚未选择'));
    }
    lines.push('随机画风：' + (state.style || '尚未抽取'));
    lines.push('随机构图：' + (state.composition || '尚未抽取'));
    lines.push('随机配色：' + (state.palette ? state.palette.name + '（' + state.palette.colors.join('、') + '）' : '尚未抽取'));
    if (state.mode === 'emoji' && state.aiIdeas.length) {
      lines.push('本组特征：' + state.emojis.map(item => item.name + '（' + item.shape + '，' + item.detail + '）').join('；'));
      lines.push('AI 联想与想象（仅参考）：');
      state.aiIdeas.forEach((idea, index) => lines.push((index + 1) + '. ' + idea));
    }
    lines.push('');
    lines.push('提示：以上只是起点，优先你自己的想法，可以完全不用这些灵感。');
    return lines;
  }

  function buildSummaryText() { return buildSummaryLines().join('\n'); }

  function renderSummary() {
    const emojiLine = state.mode === 'scene'
      ? '<span class="muted">本模式不使用 emoji</span>'
      : '<span class="summary-emoji">' + state.emojis.map(item => escapeHTML(item.char)).join(' ') + '</span>';
    const sceneLine = state.mode === 'emoji'
      ? '<span class="muted">本模式不使用场景图</span>'
      : escapeHTML(state.currentScene?.name || '尚未选择场景图');
    const palette = state.palette;
    const paletteLine = palette
      ? escapeHTML(palette.name) + '<span class="summary-mini-palette">' + palette.colors.map(color => '<i style="background:' + escapeHTML(color) + '"></i>').join('') + '</span>'
      : '<span class="muted">尚未抽取</span>';
    const aiLine = state.mode === 'emoji' && state.aiIdeas.length
      ? '<ol class="summary-ai-list">' + state.aiIdeas.map(idea => '<li>' + escapeHTML(idea) + '</li>').join('') + '</ol>'
      : '<span class="muted">' + (state.mode === 'emoji' ? '尚未生成' : '本模式不启用') + '</span>';

    ui.summaryPreview.innerHTML =
      '<div class="summary-topline"><strong>今天的小线索</strong><span>' + escapeHTML(formatDate(state.lessonDate)) + ' · ' + escapeHTML(MODE_LABELS[state.mode]) + '</span></div>' +
      '<div class="summary-blocks">' +
        '<div class="summary-row"><span>画面种子</span><div>' + emojiLine + '</div></div>' +
        '<div class="summary-row"><span>场景参考</span><div>' + sceneLine + '</div></div>' +
        '<div class="summary-row"><span>画风</span><div>' + escapeHTML(state.style || '尚未抽取') + '</div></div>' +
        '<div class="summary-row"><span>构图</span><div>' + escapeHTML(state.composition || '尚未抽取') + '</div></div>' +
        '<div class="summary-row"><span>配色</span><div>' + paletteLine + '</div></div>' +
        '<div class="summary-row"><span>联想与想象</span><div>' + aiLine + '</div></div>' +
      '</div>';
  }

  function renderAI() {
    const online = Boolean(settings.endpoint);
    ui.aiStatus.classList.toggle('is-online', online);
    ui.aiStatus.textContent = online ? '已配置网络 AI，仅在点击时发送事物名称和风格关键词' : '当前使用本地联想库，不会联网';
    ui.generateAiBtn.hidden = state.aiIdeas.length > 0;
    ui.refreshAiBtn.hidden = state.aiIdeas.length === 0;
    ui.generateAiBtn.disabled = state.aiLoading;
    ui.refreshAiBtn.disabled = state.aiLoading;
    ui.generateAiBtn.textContent = state.aiLoading ? '正在联想…' : '生成联想';
    ui.refreshAiBtn.textContent = state.aiLoading ? '正在联想…' : '换一批';
    if (state.aiLoading && !state.aiIdeas.length) {
      ui.aiIdeas.innerHTML = '<p class="empty-copy">正在寻找事物之间的奇妙联系…</p>';
      return;
    }
    if (!state.aiIdeas.length) {
      ui.aiIdeas.innerHTML = '<p class="empty-copy">会从奇妙关系、角色融合和视觉比喻三个方向展开。</p>';
      return;
    }
    const analysis = '<div class="ai-analysis"><strong>本次提取到的特征</strong><div>' +
      state.emojis.map(item => '<span><b>' + escapeHTML(item.name) + '</b>：' + escapeHTML(item.shape) + '，' + escapeHTML(item.detail) + '</span>').join('') +
      '</div></div>';
    ui.aiIdeas.innerHTML = analysis + state.aiIdeas.map((idea, index) =>
      '<div class="ai-idea"><span class="ai-idea-number">' + (index + 1) + '</span><span>' + escapeHTML(idea) + '</span></div>'
    ).join('');
  }

  function shuffledCopy(items) {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
    }
    return copy;
  }

  function makeLocalIdeas() {
    const emojis = state.emojis.length === 3 ? state.emojis : EMOJI_POOL.slice(0, 3);
    const bodyParts = ['帽子', '披风', '尾巴', '背包', '角', '面具', '影子', '脚印'];
    const containers = ['透明容器', '漂浮小岛', '会呼吸的房子', '打开的宝箱', '软绵绵的云朵', '巨大的影子'];
    const pickThree = () => {
      const [a, b, c] = shuffledCopy(emojis);
      return { a, b, c };
    };

    const characterBuilders = [
      () => {
        const { a, b, c } = pickThree();
        return '角色融合：以' + a.name + '的' + a.shape + '为骨架，用' + b.name + '的' + b.detail + '覆盖表面，再让' + c.name + '的' + c.shape + '长成它的' + randomItem(bodyParts) + '。';
      },
      () => {
        const { a, b, c } = pickThree();
        return '新角色：' + a.name + '保留' + a.detail + '，身体换成' + b.name + '的' + b.shape + '，只会重复“' + c.action + '”这个动作。';
      },
      () => {
        const { a, b, c } = pickThree();
        return '角色拼接：' + a.name + '的' + a.detail + '长在' + b.name + '的' + b.shape + '上，' + c.name + '的' + c.shape + '变成它的' + randomItem(bodyParts) + '，三种特征同时可辨。';
      },
      () => {
        const { a, b, c } = pickThree();
        return '混合生物：用' + a.name + '的' + a.shape + '包住' + b.name + '的' + b.detail + '，让' + c.name + '的“' + c.action + '”变成它唯一的移动方式。';
      }
    ];

    const relationshipBuilders = [
      () => {
        const { a, b, c } = pickThree();
        return '奇妙关系：' + a.name + '用' + a.detail + '包住' + b.name + '的' + b.shape + '，' + c.name + '用“' + c.action + '”把它打开。';
      },
      () => {
        const { a, b, c } = pickThree();
        return '功能交换：' + a.name + '获得“' + b.action + '”，' + b.name + '学会“' + a.action + '”，' + c.name + '的' + c.detail + '成为交换后的共同标记。';
      },
      () => {
        const { a, b, c } = pickThree();
        return '意外连接：把' + b.name + '的' + b.shape + '变成' + a.name + '的' + randomItem(containers) + '，' + c.name + '的' + c.detail + '是进入其中的唯一线索。';
      },
      () => {
        const { a, b, c } = pickThree();
        return '互相借用：' + a.name + '把' + a.detail + '借给' + b.name + '，' + b.name + '把自己的' + b.shape + '换给' + c.name + '，三者组成一个共用同一套特征的新形态。';
      }
    ];

    const metaphorBuilders = [
      () => {
        const { a, b, c } = pickThree();
        return '尺度游戏：让' + b.name + '缩小到像' + b.detail + '一样小，住在' + a.name + '的' + a.shape + '里，' + c.name + '的“' + c.action + '”会成为它的回应。';
      },
      () => {
        const { a, b, c } = pickThree();
        return '视觉比喻：把' + c.name + '的' + c.shape + '当作' + a.name + '和' + b.name + '共用的' + randomItem(containers) + '，' + a.name + '的' + a.detail + '与' + b.name + '的' + b.detail + '在表面互相渗透。';
      },
      () => {
        const { a, b, c } = pickThree();
        return '材质转译：把' + a.name + '的“' + a.action + '”变成' + b.name + '的' + b.detail + '，再用' + c.name + '的' + c.shape + '固定住这种变化后的形状。';
      },
      () => {
        const { a, b, c } = pickThree();
        return '嵌套想象：' + a.name + '的' + a.shape + '与' + b.name + '的' + b.shape + '互相嵌套，' + c.name + '的“' + c.action + '”是让它们保持合体的机关。';
      }
    ];

    const ideas = [
      randomItem(characterBuilders)(),
      randomItem(relationshipBuilders)(),
      randomItem(metaphorBuilders)()
    ];
    return [...new Set(ideas)].slice(0, 3);
  }

  function featureFragments() {
    const ignored = new Set(['身体', '表面', '颜色', '动作', '局部', '形状', '细节', '纹理', '变化', '材质']);
    const fragments = new Set();
    state.emojis.forEach(item => {
      [item.shape, item.detail, item.action].filter(Boolean).forEach(feature => {
        feature.split(/[和与、，。；;\s]/).filter(Boolean).forEach(chunk => {
          for (let size = 2; size <= Math.min(4, chunk.length); size += 1) {
            for (let index = 0; index <= chunk.length - size; index += 1) {
              const fragment = chunk.slice(index, index + size);
              if (!ignored.has(fragment)) fragments.add(fragment);
            }
          }
        });
      });
    });
    return [...fragments];
  }

  function normalizeIdeas(payload) {
    const raw = payload?.ideas || payload?.data?.ideas || payload?.suggestions || [];
    if (!Array.isArray(raw)) return [];
    const compositionAdvice = /(构图|视角|镜头|打光|留白|三分法|主体位置|画面中央|低机位|高机位)/;
    const subjectNames = state.emojis.map(item => item.name).filter(Boolean);
    const fragments = featureFragments();
    return raw.filter(item => typeof item === 'string')
      .map(item => item.trim().replace(/^[\d\s.、-]+/, ''))
      .filter(item => {
        if (!item || compositionAdvice.test(item)) return false;
        const namedSubjects = subjectNames.filter(name => item.includes(name)).length;
        const featureHits = fragments.filter(fragment => item.includes(fragment));
        return namedSubjects >= 2 && featureHits.length >= 2;
      })
      .slice(0, 3).map(item => item.slice(0, 180));
  }

  function parseModelJSON(content) {
    const cleaned = String(content || '').trim().replace(/^\x60{3}(?:json)?\s*/i, '').replace(/\s*\x60{3}$/, '');
    try { return JSON.parse(cleaned); }
    catch {
      const start = cleaned.indexOf('{');
      const end = cleaned.lastIndexOf('}');
      if (start >= 0 && end > start) return JSON.parse(cleaned.slice(start, end + 1));
      throw new Error('AI 返回格式无法识别');
    }
  }

  async function requestAI() {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 30000);
    const seed = {
      emojis: state.emojis.map(item => item.char + ' ' + item.name),
      features: state.emojis.map(item => ({ name: item.name, shape: item.shape, detail: item.detail, action: item.action })),
      creativeHints: [state.style, state.palette?.name].filter(Boolean),
      count: 3
    };
    try {
      let response;
      const headers = { 'Content-Type': 'application/json' };
      if (settings.apiKey) headers.Authorization = 'Bearer ' + settings.apiKey;
      if (settings.model) {
        const messages = [
          { role: 'system', content: '你是儿童美术课的“联想与想象”启发助手，不是构图上色指导。请根据三个 emoji 生成最多3条简短创意种子：第1条把三者元素融合成一个新角色、生物或物件；第2条想象三者之间一个意外、非现实的关系或功能互换；第3条用其中一个事物作为尺度、容器、材质或隐喻来重新理解另外两个。每条必须直接使用至少两个事物的具体外形、细节或动作特征，不能只写“组合特征”“奇妙关系”这类空泛说法。禁止输出构图、视角、镜头、光线、留白、主体位置等指导；禁止写完整故事或连续情节。内容适龄、温和、具体，每条不超过70个汉字。严格返回 JSON 对象：{"ideas":["..."]}' },
          { role: 'user', content: '围绕这些事物生成联想与想象种子，不要给构图建议：' + JSON.stringify(seed) }
        ];
        response = await fetch(settings.endpoint, {
          method: 'POST', headers, signal: controller.signal,
          body: JSON.stringify({ model: settings.model, messages, temperature: .9, response_format: { type: 'json_object' } })
        });
      } else {
        response = await fetch(settings.endpoint, {
          method: 'POST', headers, signal: controller.signal, body: JSON.stringify(seed)
        });
      }
      if (!response.ok) throw new Error('AI 服务返回 ' + response.status);
      const payload = await response.json();
      if (settings.model) {
        const content = payload?.choices?.[0]?.message?.content;
        if (!content) throw new Error('AI 服务没有返回文字');
        return normalizeIdeas(parseModelJSON(content));
      }
      return normalizeIdeas(payload);
    } finally { window.clearTimeout(timeout); }
  }

  async function generateAI() {
    if (state.aiLoading) return;
    if (!state.emojis.length) fillEmojis();
    state.aiLoading = true;
    renderAI();
    try {
      let ideas = [];
      let usedFallback = false;
      let fallbackMessage = '网络灵感暂不可用，已改用本地特征联想。';
      if (settings.endpoint) {
        try {
          ideas = await requestAI();
          if (!ideas.length) throw new Error('AI 没有返回有效灵感');
        } catch (error) {
          console.warn(error);
          usedFallback = true;
          if (/有效灵感/.test(error.message)) fallbackMessage = '网络结果缺少具体特征，已改用本地特征联想。';
          ideas = makeLocalIdeas();
        }
      } else {
        await new Promise(resolve => window.setTimeout(resolve, 380));
        ideas = makeLocalIdeas();
      }
      state.aiIdeas = ideas.slice(0, 3);
      renderAI(); renderSummary(); saveCurrentState();
      toast(usedFallback ? fallbackMessage : (settings.endpoint ? 'AI 联想与想象已生成。' : '本地特征联想已生成。'), usedFallback);
    } catch (error) {
      console.error(error);
      state.aiIdeas = makeLocalIdeas();
      renderAI(); renderSummary(); saveCurrentState();
      toast('已改用本地联想库。');
    } finally {
      state.aiLoading = false;
      renderAI();
    }
  }

  function renderStudentWorks() {
    if (!state.currentWorks.length) {
      ui.studentGrid.innerHTML = '<div class="student-empty">还没有添加学生作品图片</div>';
      return;
    }
    ui.studentGrid.innerHTML = state.currentWorks.map(item =>
      '<div class="student-item" data-work-id="' + escapeHTML(item.id) + '">' +
        '<img alt="' + escapeHTML(item.name || '学生作品') + '" data-load-work="' + escapeHTML(item.id) + '">' +
        '<button type="button" class="student-remove" data-remove-work="' + escapeHTML(item.id) + '" aria-label="移除图片">×</button>' +
      '</div>'
    ).join('');
    $$('[data-load-work]', ui.studentGrid).forEach(async image => {
      const dataURL = await imageDataURL(image.dataset.loadWork);
      if (dataURL) image.src = dataURL;
    });
  }

  async function handleSceneFiles(files) {
    if (!files?.length) return;
    const items = Array.from(files);
    ui.sceneUploadInput.value = '';
    let added = 0;
    for (const file of items) {
      try {
        const record = await saveCompressedFile(file, 'scene-gallery', 1280, 'scene');
        state.gallery.push(record);
        added += 1;
      } catch (error) {
        console.error(error);
        toast(file.name + '：' + error.message, true);
      }
    }
    if (added) {
      toast('已导入 ' + added + ' 张场景图。');
      renderGallery();
      ui.sceneCountLabel.textContent = state.gallery.length + ' 张';
      if (state.mode !== 'emoji' && !state.currentScene) await rollScene(false);
    }
  }

  async function handleStudentFiles(files) {
    if (!files?.length) return;
    const items = Array.from(files);
    ui.studentWorkInput.value = '';
    let added = 0;
    for (const file of items) {
      try {
        const record = await saveCompressedFile(file, 'student-work', 1000, 'work');
        state.currentWorks.push({ id: record.id, name: record.name, createdAt: record.createdAt });
        added += 1;
      } catch (error) {
        console.error(error);
        toast(file.name + '：' + error.message, true);
      }
    }
    if (added) {
      toast('已添加 ' + added + ' 张学生作品。');
      renderStudentWorks();
      saveCurrentState();
    }
  }

  async function removeCurrentWork(id) {
    await dbDeleteImage(id);
    state.currentWorks = state.currentWorks.filter(item => item.id !== id);
    renderStudentWorks();
    saveCurrentState();
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      toast('创作信息卡已复制。');
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
      toast('创作信息卡已复制。');
    }
  }

  async function switchMode(mode) {
    if (!MODE_LABELS[mode] || state.mode === mode) return;
    state.mode = mode;
    if (mode === 'scene' && !state.currentScene && state.gallery.length) await rollScene(false);
    renderMode();
    renderSummary();
    if (mode !== 'emoji') ui.aiDrawer.open = false;
    saveCurrentState();
  }

  async function newRound() {
    state.emojis = [];
    fillEmojis();
    state.aiIdeas = [];
    rollAllPrompts(false);
    if (state.mode !== 'emoji') await rollScene(false);
    renderEmojiCards();
    renderMode();
    renderSummary();
    renderAI();
    saveCurrentState();
    toast('已经换了一组画面种子。');
  }

  async function resetRound() {
    const button = ui.resetRoundBtn;
    if (button.dataset.confirm !== '1') {
      button.dataset.confirm = '1';
      button.textContent = '再点一次确认重置';
      window.setTimeout(() => {
        if (button.dataset.confirm === '1') {
          button.dataset.confirm = '0';
          button.textContent = '重置本轮抽取';
        }
      }, 3500);
      return;
    }
    button.dataset.confirm = '0';
    button.textContent = '重置本轮抽取';
    const workIds = state.currentWorks.map(item => item.id);
    await Promise.all(workIds.map(id => dbDeleteImage(id)));
    state.emojis = [];
    fillEmojis();
    state.currentScene = null;
    state.aiIdeas = [];
    state.currentWorks = [];
    state.style = '';
    state.composition = '';
    state.palette = null;
    state.notes = '';
    ui.teacherNotes.value = '';
    rollAllPrompts(false);
    if (state.mode !== 'emoji' && state.gallery.length) await rollScene(false);
    renderEmojiCards();
    renderMode();
    renderStudentWorks();
    renderSummary();
    renderAI();
    saveCurrentState();
    toast('本轮抽取已重置，已有课程档案不受影响。');
  }

  function persistArchives(nextArchives) {
    const sorted = [...nextArchives].sort((a, b) => String(b.savedAt || b.createdAt || '').localeCompare(String(a.savedAt || a.createdAt || '')));
    if (!writeJSON(STORAGE.archives, sorted)) return false;
    state.archives = sorted;
    updateArchiveCount();
    return true;
  }

  function updateArchiveCount() {
    ui.archiveCount.textContent = state.archives.length;
  }

  async function snapshotCurrentScene() {
    if (!state.currentScene?.id) return null;
    const dataURL = state.currentScene.dataUrl || await imageDataURL(state.currentScene.id);
    if (!dataURL) return null;
    const blob = await dataURLToBlob(dataURL);
    const record = {
      id: makeId('archive-scene'),
      kind: 'archive-scene',
      name: state.currentScene.name || '场景参考',
      createdAt: new Date().toISOString(),
      blob
    };
    await dbPutImage(record);
    return { imageId: record.id, name: record.name };
  }

  async function saveCurrentArchive() {
    if (ui.saveArchiveBtn.disabled) return;
    ui.saveArchiveBtn.disabled = true;
    ui.saveArchiveBtn.textContent = '正在保存…';
    try {
      const scene = state.mode === 'emoji' ? null : await snapshotCurrentScene();
      const archive = {
        id: makeId('lesson'),
        schemaVersion: 1,
        lessonDate: state.lessonDate || localDateString(),
        mode: state.mode,
        modeLabel: MODE_LABELS[state.mode],
        inspiration: {
          emojis: state.mode === 'scene' ? [] : state.emojis.map(item => ({ char: item.char, name: item.name })),
          scene,
          style: state.style,
          composition: state.composition,
          palette: state.palette ? { name: state.palette.name, colors: [...state.palette.colors] } : null,
          aiIdeas: state.mode === 'emoji' ? [...state.aiIdeas] : []
        },
        teacherNotes: ui.teacherNotes.value.trim().slice(0, 3000),
        studentWorks: state.currentWorks.map(item => ({ id: item.id, name: item.name, createdAt: item.createdAt })),
        summaryText: buildSummaryText(),
        createdAt: new Date().toISOString(),
        savedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      if (!persistArchives([archive, ...state.archives])) {
        if (scene) await dbDeleteImage(scene.imageId);
        return;
      }
      state.currentWorks = [];
      state.notes = '';
      ui.teacherNotes.value = '';
      renderStudentWorks();
      saveCurrentState();
      renderArchives();
      updateStoragePill();
      toast('课程档案已保存，可以继续创作或导出备份。');
    } catch (error) {
      console.error(error);
      toast('档案保存失败：' + error.message, true);
    } finally {
      ui.saveArchiveBtn.disabled = false;
      ui.saveArchiveBtn.textContent = '保存为课程档案';
    }
  }

  function archiveEmojiMarkup(archive) {
    const emojis = archive.inspiration?.emojis || [];
    if (!emojis.length) return '<span class="muted small">场景图模式</span>';
    return '<span class="archive-emoji">' + emojis.map(item => escapeHTML(item.char)).join(' ') + '</span>';
  }

  function archivePreviewId(archive) {
    return archive.studentWorks?.[0]?.id || archive.inspiration?.scene?.imageId || '';
  }

  function archiveDetailMarkup(archive) {
    const inspiration = archive.inspiration || {};
    const palette = inspiration.palette;
    const aiIdeas = inspiration.aiIdeas || [];
    const emojis = (inspiration.emojis || []).map(item => item.char + ' ' + item.name).join(' · ');
    const paletteMarkup = palette
      ? escapeHTML(palette.name || '配色') + '<span class="summary-mini-palette">' + (palette.colors || []).map(color => '<i style="background:' + escapeHTML(color) + '"></i>').join('') + '</span>'
      : '未记录';
    const workMarkup = (archive.studentWorks || []).length
      ? '<div class="archive-work-grid">' + archive.studentWorks.map(work => '<img alt="' + escapeHTML(work.name || '学生作品') + '" data-archive-work="' + escapeHTML(work.id) + '">').join('') + '</div>'
      : '<div class="archive-work-missing">没有上传学生作品</div>';
    return '<div class="archive-detail">' +
      '<div class="archive-detail-grid">' +
        '<div class="archive-detail-card">' +
          '<h4>本次灵感</h4>' +
          (emojis ? '<p><strong>emoji：</strong>' + escapeHTML(emojis) + '</p>' : '') +
          (inspiration.scene?.name ? '<p><strong>场景：</strong>' + escapeHTML(inspiration.scene.name) + '</p>' : '') +
          '<p><strong>画风：</strong>' + escapeHTML(inspiration.style || '未记录') + '</p>' +
          '<p><strong>构图：</strong>' + escapeHTML(inspiration.composition || '未记录') + '</p>' +
          '<p><strong>配色：</strong>' + paletteMarkup + '</p>' +
          (aiIdeas.length ? '<p><strong>联想与想象：</strong></p><ol class="summary-ai-list">' + aiIdeas.map(idea => '<li>' + escapeHTML(idea) + '</li>').join('') + '</ol>' : '') +
        '</div>' +
        '<div class="archive-detail-card">' +
          '<h4>老师教学备注</h4>' +
          '<textarea data-notes-for="' + escapeHTML(archive.id) + '" maxlength="3000" placeholder="记录学生表现、观察和下次重点…">' + escapeHTML(archive.teacherNotes || '') + '</textarea>' +
          '<h4 style="margin-top:14px">学生作品</h4>' +
          workMarkup +
        '</div>' +
      '</div>' +
      '<div class="archive-detail-actions">' +
        '<button type="button" class="button button-primary button-small" data-archive-action="save-notes" data-id="' + escapeHTML(archive.id) + '">保存备注</button>' +
        '<button type="button" class="button button-danger-quiet button-small" data-archive-action="delete" data-id="' + escapeHTML(archive.id) + '">删除档案</button>' +
      '</div>' +
    '</div>';
  }

  function renderArchives() {
    updateArchiveCount();
    if (!state.archives.length) {
      const template = $('#emptyArchivesTemplate');
      ui.archiveList.innerHTML = '';
      ui.archiveList.appendChild(template.content.cloneNode(true));
      return;
    }
    ui.archiveList.innerHTML = state.archives.map(archive => {
      const expanded = state.expandedArchives.has(archive.id);
      const mode = MODE_LABELS[archive.mode] || archive.modeLabel || archive.mode || '课程';
      const previewId = archivePreviewId(archive);
      const note = archive.teacherNotes || '暂无教学备注';
      return '<article class="archive-card" data-archive-card="' + escapeHTML(archive.id) + '">' +
        '<div class="archive-summary">' +
          '<div class="archive-thumb" data-archive-preview="' + escapeHTML(previewId) + '"><span class="thumb-fallback">▤</span></div>' +
          '<div class="archive-copy">' +
            '<div class="archive-title-line"><strong>' + escapeHTML(formatDate(archive.lessonDate)) + '</strong><span class="archive-mode">' + escapeHTML(mode) + '</span></div>' +
            '<div class="archive-meta">' + archiveEmojiMarkup(archive) + '<span>' + (archive.studentWorks?.length || 0) + ' 张学生作品</span></div>' +
            '<div class="archive-note-preview">' + escapeHTML(note) + '</div>' +
          '</div>' +
          '<button type="button" class="button button-quiet button-small archive-toggle" data-archive-action="toggle" data-id="' + escapeHTML(archive.id) + '">' + (expanded ? '收起' : '查看') + '</button>' +
        '</div>' +
        (expanded ? archiveDetailMarkup(archive) : '') +
      '</article>';
    }).join('');

    $$('[data-archive-preview]', ui.archiveList).forEach(async thumb => {
      const id = thumb.dataset.archivePreview;
      if (!id) return;
      const dataURL = await imageDataURL(id);
      if (!dataURL) return;
      thumb.innerHTML = '<img alt="档案预览" src="' + dataURL + '">';
    });
    $$('[data-archive-work]', ui.archiveList).forEach(async image => {
      const dataURL = await imageDataURL(image.dataset.archiveWork);
      if (dataURL) image.src = dataURL;
      else {
        image.outerHTML = '<div class="archive-work-missing">图片缺失</div>';
      }
    });
  }

  function toggleArchive(id) {
    if (state.expandedArchives.has(id)) state.expandedArchives.delete(id);
    else state.expandedArchives.add(id);
    renderArchives();
  }

  function saveArchiveNotes(id) {
    const archive = state.archives.find(item => item.id === id);
    if (!archive) return;
    const textarea = $('[data-notes-for="' + CSS.escape(id) + '"]', ui.archiveList);
    if (!textarea) return;
    archive.teacherNotes = textarea.value.trim().slice(0, 3000);
    archive.updatedAt = new Date().toISOString();
    if (persistArchives(state.archives)) {
      toast('教学备注已保存。');
      renderArchives();
    }
  }

  async function deleteArchive(id, button) {
    if (button.dataset.confirm !== '1') {
      button.dataset.confirm = '1';
      button.textContent = '再点一次删除';
      button.classList.add('delete-confirm');
      window.setTimeout(() => {
        if (button.isConnected) {
          button.dataset.confirm = '0';
          button.textContent = '删除档案';
          button.classList.remove('delete-confirm');
        }
      }, 3500);
      return;
    }
    const archive = state.archives.find(item => item.id === id);
    if (!archive) return;
    const imageIds = [archive.inspiration?.scene?.imageId, ...(archive.studentWorks || []).map(item => item.id)].filter(Boolean);
    await Promise.all(imageIds.map(imageId => dbDeleteImage(imageId)));
    state.expandedArchives.delete(id);
    if (persistArchives(state.archives.filter(item => item.id !== id))) {
      renderArchives();
      updateStoragePill();
      toast('课程档案已删除。');
    }
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function exportArchives() {
    if (!state.archives.length) {
      toast('还没有可导出的课程档案。', true);
      return;
    }
    ui.exportArchivesBtn.disabled = true;
    ui.exportArchivesBtn.textContent = '正在整理…';
    try {
      const archives = [];
      for (const archive of state.archives) {
        const scene = archive.inspiration?.scene?.imageId
          ? { name: archive.inspiration.scene.name, dataUrl: await imageDataURL(archive.inspiration.scene.imageId) }
          : null;
        const studentWorks = [];
        for (const work of archive.studentWorks || []) {
          const dataUrl = await imageDataURL(work.id);
          if (dataUrl) studentWorks.push({ name: work.name || '学生作品', createdAt: work.createdAt || '', dataUrl });
        }
        archives.push({
          id: archive.id,
          schemaVersion: archive.schemaVersion || 1,
          lessonDate: archive.lessonDate,
          mode: archive.mode,
          modeLabel: archive.modeLabel,
          inspiration: { ...archive.inspiration, scene, emojis: archive.inspiration?.emojis || [], aiIdeas: archive.inspiration?.aiIdeas || [] },
          teacherNotes: archive.teacherNotes || '',
          studentWorks,
          summaryText: archive.summaryText || '',
          createdAt: archive.createdAt,
          savedAt: archive.savedAt,
          updatedAt: archive.updatedAt
        });
      }
      const payload = {
        app: 'qixiang-canvas',
        schemaVersion: 1,
        exportedAt: new Date().toISOString(),
        archives
      };
      const json = JSON.stringify(payload, null, 2);
      downloadBlob(new Blob([json], { type: 'application/json' }), '奇想画板-课程档案-' + localDateString() + '.json');
      toast('已导出 ' + archives.length + ' 条课程档案。备份约 ' + Math.max(1, Math.round(new Blob([json]).size / 1024 / 1024)) + ' MB。');
    } catch (error) {
      console.error(error);
      toast('导出失败：' + error.message, true);
    } finally {
      ui.exportArchivesBtn.disabled = false;
      ui.exportArchivesBtn.textContent = '导出 JSON 备份';
    }
  }

  function validateImport(payload) {
    if (!payload || payload.app !== 'qixiang-canvas') throw new Error('这不是奇想画板的备份文件');
    if (Number(payload.schemaVersion) !== 1) throw new Error('暂不支持这个备份版本');
    if (!Array.isArray(payload.archives)) throw new Error('备份中没有课程档案');
    return payload;
  }

  async function chooseImportFile(file) {
    if (!file) return;
    try {
      if (file.size > 150 * 1024 * 1024) throw new Error('备份文件超过 150 MB');
      const payload = validateImport(JSON.parse(await file.text()));
      state.pendingImport = payload;
      ui.importPreviewText.textContent = '检测到 ' + payload.archives.length + ' 条课程档案，请选择导入方式。';
      ui.importBar.hidden = false;
    } catch (error) {
      console.error(error);
      ui.importArchivesInput.value = '';
      toast('无法导入：' + error.message, true);
    }
  }

  function cleanImportedInspiration(inspiration, scene) {
    const emojis = Array.isArray(inspiration?.emojis)
      ? inspiration.emojis.filter(item => item && typeof item.char === 'string').slice(0, 3).map(item => ({ char: String(item.char).slice(0, 8), name: String(item.name || '').slice(0, 30) }))
      : [];
    const colors = Array.isArray(inspiration?.palette?.colors)
      ? inspiration.palette.colors.filter(color => /^#[0-9a-f]{6}$/i.test(String(color))).slice(0, 5)
      : [];
    return {
      emojis,
      scene,
      style: String(inspiration?.style || '').slice(0, 80),
      composition: String(inspiration?.composition || '').slice(0, 120),
      palette: colors.length ? { name: String(inspiration?.palette?.name || '导入配色').slice(0, 40), colors } : null,
      aiIdeas: Array.isArray(inspiration?.aiIdeas)
        ? inspiration.aiIdeas.filter(item => typeof item === 'string').slice(0, 3).map(item => item.slice(0, 180))
        : []
    };
  }

  async function importPending(replaceExisting) {
    if (!state.pendingImport) return;
    const payload = state.pendingImport;
    const buttons = [ui.mergeImportBtn, ui.replaceImportBtn];
    buttons.forEach(button => { button.disabled = true; });
    ui.importPreviewText.textContent = '正在恢复图片和档案…';
    try {
      const previousArchives = replaceExisting ? [...state.archives] : [];
      const previousImageIds = previousArchives.flatMap(archive => [archive.inspiration?.scene?.imageId, ...(archive.studentWorks || []).map(item => item.id)]).filter(Boolean);
      const imported = [];
      for (const incoming of payload.archives) {
        let scene = null;
        if (incoming.inspiration?.scene?.dataUrl) {
          try {
            const blob = await dataURLToBlob(incoming.inspiration.scene.dataUrl);
            const record = {
              id: makeId('archive-scene'), kind: 'archive-scene',
              name: String(incoming.inspiration.scene.name || '场景参考').slice(0, 120),
              createdAt: new Date().toISOString(), blob
            };
            await dbPutImage(record);
            scene = { imageId: record.id, name: record.name };
          } catch (error) { console.warn('场景图恢复失败', error); }
        }
        const studentWorks = [];
        for (const work of incoming.studentWorks || []) {
          if (!work?.dataUrl) continue;
          try {
            const blob = await dataURLToBlob(work.dataUrl);
            const record = {
              id: makeId('work'), kind: 'student-work',
              name: String(work.name || '学生作品').slice(0, 120),
              createdAt: work.createdAt || new Date().toISOString(), blob
            };
            await dbPutImage(record);
            studentWorks.push({ id: record.id, name: record.name, createdAt: record.createdAt });
          } catch (error) { console.warn('学生作品恢复失败', error); }
        }
        imported.push({
          id: makeId('lesson'),
          schemaVersion: 1,
          lessonDate: /^\d{4}-\d{2}-\d{2}$/.test(incoming.lessonDate || '') ? incoming.lessonDate : localDateString(),
          mode: MODE_LABELS[incoming.mode] ? incoming.mode : 'emoji',
          modeLabel: MODE_LABELS[incoming.mode] || incoming.modeLabel || '',
          inspiration: cleanImportedInspiration(incoming.inspiration, scene),
          teacherNotes: String(incoming.teacherNotes || '').slice(0, 3000),
          studentWorks,
          summaryText: String(incoming.summaryText || '').slice(0, 15000),
          createdAt: incoming.createdAt || new Date().toISOString(),
          savedAt: incoming.savedAt || incoming.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      const nextArchives = replaceExisting ? imported : [...imported, ...state.archives];
      if (!persistArchives(nextArchives)) throw new Error('本地存储空间不足');
      if (replaceExisting) {
        state.expandedArchives.clear();
        await Promise.all(previousImageIds.map(imageId => dbDeleteImage(imageId)));
      }
      cancelImport();
      renderArchives();
      updateStoragePill();
      toast('已恢复 ' + imported.length + ' 条课程档案。');
    } catch (error) {
      console.error(error);
      toast('导入失败：' + error.message, true);
      ui.importPreviewText.textContent = '导入没有完成，请检查备份文件或本地空间。';
    } finally {
      buttons.forEach(button => { button.disabled = false; });
    }
  }

  function cancelImport() {
    state.pendingImport = null;
    ui.importBar.hidden = true;
    ui.importArchivesInput.value = '';
    ui.importPreviewText.textContent = '';
  }

  function formatClock(totalSeconds) {
    const safe = Math.max(0, Math.ceil(totalSeconds));
    const minutes = Math.floor(safe / 60);
    const seconds = safe % 60;
    return String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
  }

  function saveTimerState() {
    writeJSON(STORAGE.timer, {
      duration: state.timer.duration,
      remaining: state.timer.remaining,
      endAt: state.timer.running ? state.timer.endAt : 0,
      running: state.timer.running,
      finished: state.timer.finished
    });
  }

  function renderTimer() {
    ui.timerDisplay.textContent = formatClock(state.timer.remaining);
    ui.timerDisplay.classList.toggle('is-finished', state.timer.finished);
    ui.timerState.classList.toggle('is-running', state.timer.running);
    ui.timerState.classList.toggle('is-paused', !state.timer.running && !state.timer.finished && state.timer.remaining < state.timer.duration && state.timer.remaining > 0);
    ui.timerState.textContent = state.timer.finished ? '完成' : state.timer.running ? '专注中' : (state.timer.remaining < state.timer.duration && state.timer.remaining > 0 ? '已暂停' : '准备');
    ui.timerToggleBtn.textContent = state.timer.running ? '暂停计时' : (state.timer.finished ? '再来一次' : (state.timer.remaining < state.timer.duration ? '继续计时' : '开始计时'));
  }

  let timerAudioContext = null;
  function primeTimerAudio() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      if (!timerAudioContext) timerAudioContext = new AudioContext();
      if (timerAudioContext.state === 'suspended') timerAudioContext.resume();
    } catch {}
  }

  function playTimerChime() {
    if (!timerAudioContext) return;
    try {
      const now = timerAudioContext.currentTime;
      [0, .22, .44].forEach((offset, index) => {
        const oscillator = timerAudioContext.createOscillator();
        const gain = timerAudioContext.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.value = index === 1 ? 880 : 660;
        gain.gain.setValueAtTime(.0001, now + offset);
        gain.gain.exponentialRampToValueAtTime(.18, now + offset + .02);
        gain.gain.exponentialRampToValueAtTime(.0001, now + offset + .18);
        oscillator.connect(gain).connect(timerAudioContext.destination);
        oscillator.start(now + offset);
        oscillator.stop(now + offset + .2);
      });
    } catch {}
  }

  let wakeLock = null;
  async function requestWakeLock() {
    try {
      if ('wakeLock' in navigator && !wakeLock) {
        wakeLock = await navigator.wakeLock.request('screen');
        wakeLock.addEventListener('release', () => { wakeLock = null; });
      }
    } catch {}
  }

  async function releaseWakeLock() {
    try {
      if (wakeLock) await wakeLock.release();
    } catch {}
    wakeLock = null;
  }

  function finishTimer(showToast = true) {
    state.timer.running = false;
    state.timer.finished = true;
    state.timer.remaining = 0;
    state.timer.endAt = 0;
    releaseWakeLock();
    saveTimerState();
    renderTimer();
    playTimerChime();
    if (showToast) toast('计时结束，看看画面进行到哪一步了。');
  }

  function updateTimerFromClock(showToast = true) {
    if (!state.timer.running) return;
    const remaining = Math.max(0, Math.ceil((state.timer.endAt - Date.now()) / 1000));
    state.timer.remaining = remaining;
    if (remaining <= 0) finishTimer(showToast);
    else renderTimer();
  }

  function startTimer() {
    if (state.timer.running) {
      state.timer.remaining = Math.max(0, Math.ceil((state.timer.endAt - Date.now()) / 1000));
      state.timer.running = false;
      state.timer.endAt = 0;
      releaseWakeLock();
      saveTimerState();
      renderTimer();
      return;
    }
    if (state.timer.finished || state.timer.remaining <= 0) {
      state.timer.remaining = state.timer.duration;
      state.timer.finished = false;
    }
    primeTimerAudio();
    requestWakeLock();
    state.timer.running = true;
    state.timer.finished = false;
    state.timer.endAt = Date.now() + state.timer.remaining * 1000;
    saveTimerState();
    renderTimer();
  }

  function setTimerMinutes(minutes) {
    const safe = Math.min(180, Math.max(1, Number(minutes) || 20));
    state.timer.duration = safe * 60;
    state.timer.remaining = safe * 60;
    state.timer.running = false;
    state.timer.finished = false;
    state.timer.endAt = 0;
    releaseWakeLock();
    saveTimerState();
    renderTimer();
    toast('计时器已设为 ' + safe + ' 分钟。');
  }

  function resetTimer() {
    state.timer.running = false;
    state.timer.finished = false;
    state.timer.endAt = 0;
    state.timer.remaining = state.timer.duration;
    releaseWakeLock();
    saveTimerState();
    renderTimer();
  }

  function saveAISettings() {
    const endpoint = ui.aiEndpoint.value.trim();
    const model = ui.aiModel.value.trim();
    const apiKey = ui.aiKey.value.trim();
    if (endpoint && !/^(https?:\/\/|\/)/i.test(endpoint)) {
      toast('接口地址需要以 http://、https:// 或 / 开头。', true);
      return;
    }
    if (model && !endpoint) {
      toast('填写模型名时也需要填写接口地址。', true);
      return;
    }
    settings.endpoint = endpoint;
    settings.model = model;
    settings.apiKey = apiKey;
    writeJSON(STORAGE.settings, settings);
    renderAI();
    toast(endpoint ? 'AI 连接设置已保存。' : '已切换为本地灵感库。');
  }

  async function updateStoragePill() {
    try {
      if (!navigator.storage?.estimate) return;
      const estimate = await navigator.storage.estimate();
      const used = estimate.usage || 0;
      const quota = estimate.quota || 0;
      const usedText = used > 1024 * 1024 ? (used / 1024 / 1024).toFixed(1) + ' MB' : Math.max(1, Math.round(used / 1024)) + ' KB';
      ui.storagePill.textContent = '本地已用 ' + usedText;
      ui.storagePill.title = quota ? '浏览器本地空间：' + usedText + ' / ' + (quota / 1024 / 1024).toFixed(0) + ' MB' : '浏览器本地存储';
    } catch {}
  }

  let notesSaveTimer = null;
  function bindEvents() {
    ui.modeButtons.forEach(button => {
      button.addEventListener('click', () => switchMode(button.dataset.mode));
    });
    $('#newRoundBtn').addEventListener('click', newRound);
    ui.emojiGrid.addEventListener('click', event => {
      const card = event.target.closest('.emoji-card');
      if (card) rerollEmoji(Number(card.dataset.index));
    });
    ui.rollSceneBtn.addEventListener('click', () => rollScene(true));
    ui.sceneUploadInput.addEventListener('change', event => handleSceneFiles(event.target.files));
    ui.toggleGalleryBtn.addEventListener('click', () => {
      ui.galleryPanel.hidden = !ui.galleryPanel.hidden;
      ui.toggleGalleryBtn.setAttribute('aria-expanded', String(!ui.galleryPanel.hidden));
    });
    ui.galleryGrid.addEventListener('click', async event => {
      const button = event.target.closest('[data-delete-gallery]');
      if (!button) return;
      const id = button.dataset.deleteGallery;
      await dbDeleteImage(id);
      state.gallery = state.gallery.filter(item => item.id !== id);
      if (state.currentScene?.id === id) state.currentScene = null;
      ui.sceneCountLabel.textContent = state.gallery.length + ' 张';
      renderGallery();
      renderScene();
      renderSummary();
      saveCurrentState();
      updateStoragePill();
      toast('场景图已删除。');
    });
    $$('[data-roll]').forEach(button => {
      button.addEventListener('click', () => {
        if (button.dataset.roll === 'style') rollStyle();
        if (button.dataset.roll === 'composition') rollComposition();
        if (button.dataset.roll === 'palette') rollPalette();
        renderPrompts();
        renderSummary();
        saveCurrentState();
      });
    });
    $('#rollAllPromptsBtn').addEventListener('click', () => rollAllPrompts(true));
    ui.generateAiBtn.addEventListener('click', generateAI);
    ui.refreshAiBtn.addEventListener('click', generateAI);
    ui.saveAiSettingsBtn.addEventListener('click', saveAISettings);
    ui.lessonDate.addEventListener('change', () => {
      state.lessonDate = ui.lessonDate.value || localDateString();
      renderSummary();
      saveCurrentState();
    });
    ui.teacherNotes.addEventListener('input', () => {
      state.notes = ui.teacherNotes.value;
      window.clearTimeout(notesSaveTimer);
      notesSaveTimer = window.setTimeout(saveCurrentState, 280);
    });
    ui.studentWorkInput.addEventListener('change', event => handleStudentFiles(event.target.files));
    ui.studentGrid.addEventListener('click', event => {
      const button = event.target.closest('[data-remove-work]');
      if (button) removeCurrentWork(button.dataset.removeWork);
    });
    ui.copySummaryBtn.addEventListener('click', () => copyText(buildSummaryText()));
    ui.saveArchiveBtn.addEventListener('click', saveCurrentArchive);
    ui.resetRoundBtn.addEventListener('click', resetRound);
    ui.exportArchivesBtn.addEventListener('click', exportArchives);
    ui.importArchivesInput.addEventListener('change', event => chooseImportFile(event.target.files?.[0]));
    ui.mergeImportBtn.addEventListener('click', () => importPending(false));
    ui.replaceImportBtn.addEventListener('click', () => importPending(true));
    ui.cancelImportBtn.addEventListener('click', cancelImport);
    ui.archiveList.addEventListener('click', event => {
      const action = event.target.closest('[data-archive-action]');
      if (!action) return;
      if (action.dataset.archiveAction === 'toggle') toggleArchive(action.dataset.id);
      if (action.dataset.archiveAction === 'save-notes') saveArchiveNotes(action.dataset.id);
      if (action.dataset.archiveAction === 'delete') deleteArchive(action.dataset.id, action);
    });
    $$('.preset-button').forEach(button => {
      button.addEventListener('click', () => setTimerMinutes(button.dataset.minutes));
    });
    $('#setCustomTimerBtn').addEventListener('click', () => setTimerMinutes(ui.customMinutes.value));
    ui.timerToggleBtn.addEventListener('click', startTimer);
    ui.timerResetBtn.addEventListener('click', resetTimer);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) updateTimerFromClock(true);
    });
    window.addEventListener('beforeunload', saveCurrentState);
    window.addEventListener('pagehide', saveCurrentState);
  }

  async function init() {
    ui.lessonDate.value = state.lessonDate;
    ui.teacherNotes.value = state.notes;
    ui.aiEndpoint.value = settings.endpoint;
    ui.aiModel.value = settings.model;
    ui.aiKey.value = settings.apiKey;
    if (!state.emojis.length) fillEmojis();
    if (!state.style) rollStyle();
    if (!state.composition) rollComposition();
    if (!state.palette) rollPalette();
    renderEmojiCards();
    renderPrompts();
    renderMode();
    renderSummary();
    renderAI();
    renderTimer();
    renderStudentWorks();
    renderArchives();
    bindEvents();
    await refreshGallery();
    updateStoragePill();

    if (state.timer.running) updateTimerFromClock(false);
    window.setInterval(() => updateTimerFromClock(true), 500);
  }

  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(error => console.warn('离线缓存注册失败', error)));
  }

  init().catch(error => {
    console.error(error);
    toast('应用初始化失败，请刷新页面后重试。', true);
  });
})();
