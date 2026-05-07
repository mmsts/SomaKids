// src/lib/aiEngine.js
//
// SomaKids 家长端「类AI」推理引擎。
// 把孩子口语化、感性的描述,翻译成家长可读、可决策的半专业信息:
//   1. 关键词命中 + 加权打分,选出最强信号
//   2. 用「翻译官式」模板把感性词嵌回到生理学解释中
//   3. 输出三档递进式建议(即刻舒缓 → 进阶观察 → 就医指引)
//   4. 命中越密集 → 风险等级越高,供上层 UI 配色与提示

const PART_LABEL = {
  head: '头部',
  chest: '胸部',
  stomach: '胃部',
};

const RULES = {
  head: [
    {
      tag: '头晕',
      keywords: ['晕', '转', '飘', '晃', '摇'],
      weight: 1,
      physiology: '前庭系统或脑部短暂供血',
      sign: '短暂的眩晕或平衡感失调',
      causes: '体位性低血压、低血糖、过度疲劳或内耳平衡功能波动',
      suggestions: [
        {
          level: 1,
          emoji: '🌿',
          title: '即刻舒缓',
          detail:
            '让孩子立刻坐下或平躺,闭眼休息 5–10 分钟,避免突然起立或剧烈活动;可饮一小杯温水补充水分。',
        },
        {
          level: 2,
          emoji: '🔍',
          title: '进阶观察',
          detail:
            '记录眩晕的发作时长、频率与诱因;留意是否伴随恶心、视物旋转或脸色苍白,必要时测量体温与脉搏。',
        },
        {
          level: 3,
          emoji: '🩺',
          title: '就医指引',
          detail:
            '若眩晕持续 30 分钟以上未缓解、反复发作,或伴随呕吐、意识模糊、肢体无力,请尽快前往儿科或神经内科就诊。',
        },
      ],
    },
    {
      tag: '头痛',
      keywords: ['疼', '痛', '胀', '锤', '砰'],
      weight: 1.2,
      physiology: '头皮、颅内血管或鼻窦通路',
      sign: '紧张性或血管搏动性头痛迹象',
      causes: '用脑过度、睡眠不足、轻度脱水、屏幕疲劳或鼻窦轻度炎症',
      suggestions: [
        {
          level: 1,
          emoji: '🌿',
          title: '即刻舒缓',
          detail:
            '关闭强光与噪音,让孩子在安静的房间里闭眼平躺 15–20 分钟;前额温敷或冷敷,并补充温水。',
        },
        {
          level: 2,
          emoji: '🔍',
          title: '进阶观察',
          detail:
            '请孩子描述疼痛位置(前额/太阳穴/后脑)与性质(钝痛/搏动);测量体温,留意饮水、睡眠与屏幕时长是否规律。',
        },
        {
          level: 3,
          emoji: '🩺',
          title: '就医指引',
          detail:
            '若头痛持续 4 小时以上未缓解,或伴随发热超过 38.5°C、呕吐、视物模糊、意识改变,建议尽快前往儿科就诊。',
        },
      ],
    },
    {
      tag: '头部沉重',
      keywords: ['闷', '沉', '重', '懵'],
      weight: 0.9,
      physiology: '颅内压力调节与鼻窦腔',
      sign: '头部胀闷感或轻度压迫感',
      causes: '睡眠不足、空气流通不佳、鼻塞或轻度脱水',
      suggestions: [
        {
          level: 1,
          emoji: '🌿',
          title: '即刻舒缓',
          detail:
            '打开窗户保持空气流通,暂时离开屏幕,做几次缓慢的腹式呼吸,并喝一杯温水放松紧绷的颈肩。',
        },
        {
          level: 2,
          emoji: '🔍',
          title: '进阶观察',
          detail:
            '检查是否伴随鼻塞、流涕或耳闷;留意是否在长时间用脑、低头或熬夜后更明显,记录持续时间。',
        },
        {
          level: 3,
          emoji: '🩺',
          title: '就医指引',
          detail:
            '若伴随明显头痛、持续发热或半天以上未缓解并影响精神状态,建议前往儿科评估有无鼻窦或视疲劳问题。',
        },
      ],
    },
  ],

  chest: [
    {
      tag: '胸闷',
      keywords: ['闷', '紧', '压', '堵', '憋'],
      weight: 1.2,
      physiology: '胸腔与呼吸肌群',
      sign: '胸腔的压迫感或呼吸不畅感',
      causes: '情绪紧张引起的躯体化反应、过敏性气道反应或运动后换气不足',
      suggestions: [
        {
          level: 1,
          emoji: '🌿',
          title: '即刻舒缓',
          detail:
            '让孩子坐直、放松肩膀,引导其做 5 次缓慢的腹式呼吸(吸 4 秒、呼 6 秒);松开过紧的衣物。',
        },
        {
          level: 2,
          emoji: '🔍',
          title: '进阶观察',
          detail:
            '观察呼吸频率与深度(学龄儿童静息时约 18–25 次/分);留意是否伴随咳嗽、喘息、嘴唇颜色变化或冷汗。',
        },
        {
          level: 3,
          emoji: '🩺',
          title: '就医指引',
          detail:
            '若胸闷持续 15 分钟以上未缓解、出现喘鸣音、呼吸急促或嘴唇发紫,请立即就医或拨打 120。',
        },
      ],
    },
    {
      tag: '心慌',
      keywords: ['跳', '砰', '怦', '快', '急'],
      weight: 1.2,
      physiology: '心率与自主神经调节',
      sign: '心跳加快或心悸感',
      causes: '情绪激动、剧烈运动后未充分恢复、缺铁性疲劳或咖啡因摄入',
      suggestions: [
        {
          level: 1,
          emoji: '🌿',
          title: '即刻舒缓',
          detail:
            '让孩子安静坐下休息,引导慢节奏的深呼吸;轻拍后背给予安抚,避免剧烈对话或反复追问。',
        },
        {
          level: 2,
          emoji: '🔍',
          title: '进阶观察',
          detail:
            '在静息状态下数 1 分钟脉搏(学龄儿童正常 70–110 次/分),记录发作时间与是否在情绪、运动后出现。',
        },
        {
          level: 3,
          emoji: '🩺',
          title: '就医指引',
          detail:
            '若心悸反复发作,或伴随胸痛、晕厥、脸色苍白持续 10 分钟以上,建议尽快前往儿科或心内科评估。',
        },
      ],
    },
    {
      tag: '情绪压力',
      keywords: ['难受', '酸', '难过', '哭', '委屈'],
      weight: 0.8,
      physiology: '情绪中枢与躯体化通路',
      sign: '情绪积压引发的胸部不适感',
      causes: '学习压力、人际关系困扰、未表达的委屈或潜在焦虑情绪',
      suggestions: [
        {
          level: 1,
          emoji: '🌿',
          title: '即刻舒缓',
          detail:
            '先放下评判,给孩子一个拥抱或安静的陪伴空间;鼓励用画画、写日记或讲故事的方式表达情绪。',
        },
        {
          level: 2,
          emoji: '🔍',
          title: '进阶观察',
          detail:
            '关注最近的睡眠、食欲、社交是否有变化;留意是否在特定场景(上学/考试/家庭冲突)前反复出现。',
        },
        {
          level: 3,
          emoji: '🩺',
          title: '就医指引',
          detail:
            '若情绪低落持续两周以上、明显影响日常学习与生活,或出现自伤念头,请寻求心理咨询师或儿童精神科的专业帮助。',
        },
      ],
    },
  ],

  stomach: [
    {
      tag: '恶心',
      keywords: ['想吐', '吐', '恶心', '反胃', '翻', '涌'],
      weight: 1.5,
      physiology: '胃部与迷走神经反射',
      sign: '胃部不适伴随的呕吐反射',
      causes: '饮食不洁、肠胃感染初期、晕动症或强烈情绪刺激',
      suggestions: [
        {
          level: 1,
          emoji: '🌿',
          title: '即刻舒缓',
          detail:
            '让孩子侧卧休息,少量多次饮用温水或口服补液盐;暂停进食 1–2 小时,避免油腻、甜食与奶制品。',
        },
        {
          level: 2,
          emoji: '🔍',
          title: '进阶观察',
          detail:
            '记录呕吐次数、内容物(食物/胆汁/血丝)、是否伴随发热、腹泻或腹痛;关注精神状态与排尿量。',
        },
        {
          level: 3,
          emoji: '🩺',
          title: '就医指引',
          detail:
            '若呕吐超过 6 小时无法进水、出现脱水迹象(少尿、口干、嗜睡)或呕吐物带血,请立即就医。',
        },
      ],
    },
    {
      tag: '胃痛',
      keywords: ['疼', '痛', '绞', '抽', '拧', '刀'],
      weight: 1.5,
      physiology: '胃壁与肠道平滑肌',
      sign: '上腹部或脐周的痉挛或牵拉感',
      causes: '进食过快、腹部受凉、肠胃炎、便秘或轻度食物不耐受',
      suggestions: [
        {
          level: 1,
          emoji: '🌿',
          title: '即刻舒缓',
          detail:
            '让孩子蜷腿侧卧,腹部温敷 10–15 分钟;少量饮用温水,避免冷饮、油腻和高糖食物。',
        },
        {
          level: 2,
          emoji: '🔍',
          title: '进阶观察',
          detail:
            '询问疼痛位置(上腹/脐周/右下腹)、性质(绞痛/钝痛)及与进食、排便的关系,记录发作频率。',
        },
        {
          level: 3,
          emoji: '🩺',
          title: '就医指引',
          detail:
            '若疼痛固定在右下腹、持续 2 小时以上加重,或伴随发热、呕吐、便血,需警惕急腹症,请立即就医。',
        },
      ],
    },
    {
      tag: '消化不良',
      keywords: ['胀', '撑', '满', '鼓', '硬'],
      weight: 1,
      physiology: '胃肠蠕动与排空功能',
      sign: '上腹部胀满或饱胀感',
      causes: '进食过快过多、食物搭配不当、缺乏运动或肠道菌群短期失衡',
      suggestions: [
        {
          level: 1,
          emoji: '🌿',
          title: '即刻舒缓',
          detail:
            '暂停加餐,鼓励餐后散步 15 分钟;可顺时针轻柔按摩腹部,帮助胃肠蠕动。',
        },
        {
          level: 2,
          emoji: '🔍',
          title: '进阶观察',
          detail:
            '观察排气、排便是否通畅;回顾近 24 小时饮食结构,注意是否摄入过多奶制品、高糖或高脂食物。',
        },
        {
          level: 3,
          emoji: '🩺',
          title: '就医指引',
          detail:
            '若胀满持续超过一天伴随呕吐、停止排便排气,或腹部硬如板状,需警惕肠梗阻,请立即就医。',
        },
      ],
    },
    {
      tag: '饥饿感',
      keywords: ['饿', '空', '咕咕'],
      weight: 0.5,
      physiology: '胃部空腹蠕动',
      sign: '活跃的肠鸣音',
      causes: '饥饿感、空气吞咽或轻微的胃肠蠕动加速',
      suggestions: [
        {
          level: 1,
          emoji: '🌿',
          title: '即刻舒缓',
          detail:
            '准备一份易消化的小份加餐,例如温牛奶、香蕉、燕麦或苏打饼干;避免立即吃高糖零食或冷饮。',
        },
        {
          level: 2,
          emoji: '🔍',
          title: '进阶观察',
          detail:
            '留意每日三餐时间是否规律,记录两餐之间是否过度饥饿,以及孩子的精力与情绪状态。',
        },
        {
          level: 3,
          emoji: '🩺',
          title: '就医指引',
          detail:
            '若伴随手抖、心慌、出冷汗或近期体重明显下降,需排查低血糖或代谢相关问题,请前往儿科就诊。',
        },
      ],
    },
    {
      tag: '情绪性反应',
      keywords: ['紧张', '蝴蝶', '飞', '怕', '担心'],
      weight: 0.8,
      physiology: '脑-肠轴与自主神经',
      sign: '情绪驱动的胃肠躯体化反应',
      causes: '考试焦虑、社交压力、分离焦虑或对新环境的紧张反应',
      suggestions: [
        {
          level: 1,
          emoji: '🌿',
          title: '即刻舒缓',
          detail:
            '帮助孩子识别情绪,先做 5 次缓慢的深呼吸;用轻柔的肢体接触或熟悉的玩具给予安全感。',
        },
        {
          level: 2,
          emoji: '🔍',
          title: '进阶观察',
          detail:
            '留意该感觉是否只在特定场景前出现(如上学、考试、表演);记录是否伴随睡眠或食欲变化。',
        },
        {
          level: 3,
          emoji: '🩺',
          title: '就医指引',
          detail:
            '若该躯体反应反复影响上学或日常生活、持续超过两周,建议寻求儿童心理咨询的专业支持。',
        },
      ],
    },
  ],
};

// ───── 情绪信号词典 ─────────────────────────────────────────────

const UNIVERSAL_EMOTION_MAP = {
  '不想说话': { emotion: '委屈', weight: 0.9 },
  '不想动':   { emotion: '疲惫', weight: 0.7 },
  '烦':       { emotion: '烦躁', weight: 0.8 },
  '烦死了':   { emotion: '烦躁', weight: 0.9 },
  '好烦':     { emotion: '烦躁', weight: 0.8 },
  '害怕':     { emotion: '害怕', weight: 0.9 },
  '怕':       { emotion: '害怕', weight: 0.7 },
  '担心':     { emotion: '担心', weight: 0.8 },
  '睡不着':   { emotion: '焦虑', weight: 0.7 },
  '不想吃':   { emotion: '低落', weight: 0.6 },
  '想哭':     { emotion: '委屈', weight: 0.85 },
  '怪怪的':   { emotion: '不安', weight: 0.8 },
  '不舒服':   { emotion: '不安', weight: 0.5 },
  '喘不过气': { emotion: '紧张', weight: 0.9 },
  '堵住':     { emotion: '压抑', weight: 0.85 },
  '压着':     { emotion: '压力', weight: 0.85 },
  '爆炸':     { emotion: '焦虑', weight: 0.8 },
};

const EMOTION_SIGNALS = {
  head: [
    { emotion: '紧张', keywords: ['晕', '转', '懵', '沉沉的', '想不清'], weight: 0.6 },
    { emotion: '疲劳', keywords: ['累', '困', '沉', '重', '没精神'], weight: 0.5 },
  ],
  chest: [
    { emotion: '紧张', keywords: ['闷', '紧', '压', '堵', '憋', '喘不过气'], weight: 0.8 },
    { emotion: '委屈', keywords: ['酸', '难过', '哭', '委屈', '想哭'], weight: 0.7 },
    { emotion: '害怕', keywords: ['跳', '怦', '快', '急', '慌', '怕'], weight: 0.6 },
  ],
  stomach: [
    { emotion: '紧张', keywords: ['紧张', '蝴蝶', '飞', '怕', '担心', '怪怪的'], weight: 0.8 },
    { emotion: '焦虑', keywords: ['胀', '撑', '满', '鼓', '硬', '爆炸'], weight: 0.6 },
    { emotion: '不安', keywords: ['想吐', '恶心', '反胃', '翻', '涌'], weight: 0.5 },
  ],
};

const FALLBACK_SUGGESTIONS = [
  {
    level: 1,
    emoji: '🌿',
    title: '即刻舒缓',
    detail:
      '让孩子先停下手边的事情,做几次缓慢的腹式呼吸,喝一小杯温水,在安静的角落休息一会儿。',
  },
  {
    level: 2,
    emoji: '🔍',
    title: '进阶观察',
    detail:
      '陪伴孩子,过 15–30 分钟再询问感觉是否有变化;留意精神、面色、体温与是否伴随其它不适。',
  },
  {
    level: 3,
    emoji: '🩺',
    title: '就医指引',
    detail:
      '若不适反复出现、明显加重,或伴随发热、呕吐、意识改变等异常信号,请前往儿科进行专业评估。',
  },
];

/**
 * 主入口:接收身体部位与儿童描述,返回家长向的结构化分析。
 *
 * @param {'head'|'chest'|'stomach'} bodyPart
 * @param {string} text
 */
export function analyzeInput(bodyPart, text) {
  const rules = RULES[bodyPart] || [];
  const cleaned = (text || '').trim();
  const partLabel = PART_LABEL[bodyPart] || '身体';

  // 1. 给每条规则打分:命中关键词数 × 权重
  const scored = rules
    .map((rule) => {
      const hits = rule.keywords.filter((k) => cleaned.includes(k));
      return { rule, hits, score: hits.length * rule.weight };
    })
    .sort((a, b) => b.score - a.score);

  const top = scored[0];

  // 2. 完全没匹配 → 走兜底文案,风险最低
  if (!top || top.score === 0) {
    const emotions = detectEmotions(bodyPart, cleaned);
    return {
      interpretation: cleaned
        ? `从孩子描述的"${cleaned}"来看,目前没有传递出特别明确的医学信号,可能只是${partLabel}短暂的轻微感受,建议先观察其精神与活动状态。`
        : `孩子目前没有给出更具体的描述,${partLabel}可能只是短暂的轻微不适,建议先观察精神状态与变化趋势。`,
      suggestions: FALLBACK_SUGGESTIONS,
      riskLevel: 'low',
      reasoning: {
        tags: cleaned ? [`${partLabel}区域`, '描述不太明确'] : [`${partLabel}区域`, '需要更多信息'],
        rationale: cleaned
          ? `孩子说了「${cleaned}」，但描述比较特别，SomaKids 暂时没有找到特别匹配的信号。建议先观察孩子的精神状态和活动情况。`
          : `孩子选择了「${partLabel}」区域，但还没有给出具体的描述。SomaKids 会陪家长一起，慢慢引导孩子说出更多感受。`,
      },
      bodySignals: [],
      emotionSignals: emotions,
      emotionReasoning: buildEmotionReasoning(emotions, cleaned, partLabel),
    };
  }

  // 3. 命中规模 → 风险等级
  const totalHits = scored.reduce((sum, s) => sum + s.hits.length, 0);
  const distinctTags = scored.filter((s) => s.score > 0).length;

  let riskLevel = 'low';
  if (totalHits >= 4 || (distinctTags >= 3 && totalHits >= 3)) {
    riskLevel = 'high';
  } else if (totalHits >= 2 || top.rule.weight >= 1.5) {
    riskLevel = 'medium';
  }

  const emotions = detectEmotions(bodyPart, cleaned);

  return {
    interpretation: buildInterpretation(top.rule, top.hits, partLabel),
    suggestions: top.rule.suggestions,
    riskLevel,
    reasoning: buildReasoning(top.rule, top.hits, partLabel, cleaned),
    bodySignals: buildBodySignals(scored),
    emotionSignals: emotions,
    emotionReasoning: buildEmotionReasoning(emotions, cleaned, partLabel),
  };
}

// ───── 文案生成器 ─────────────────────────────────────────────

function buildInterpretation(rule, hits, partLabel) {
  const word = hits[0];
  if (word) {
    return `从孩子描述的"${word}"来看,${partLabel}的${rule.physiology}可能正在经历${rule.sign},这通常与${rule.causes}有关。`;
  }
  return `孩子的${partLabel}可能正在经历${rule.sign},通常与${rule.causes}有关,建议继续观察。`;
}

function buildReasoning(rule, hits, partLabel, expression) {
  const tags = [];

  for (const h of hits) {
    tags.push(h);
  }
  tags.push(rule.tag);
  tags.push(`${partLabel}不舒服`);

  let rationale = '';
  const expr = (expression || '').trim();

  if (hits.length > 0) {
    const hitWords =
      hits.length === 1
        ? `「${hits[0]}」`
        : `「${hits.join('」和「')}」`;
    rationale = `因为孩子提到了${hitWords}这样的描述，并且选择了「${partLabel}」区域，SomaKids 会优先考虑${rule.tag}的感觉。`;
  } else if (expr) {
    rationale = `孩子选择了「${partLabel}」区域，说「${expr}」。虽然描述比较特别，SomaKids 还是会认真听每一个字，帮家长一起理解孩子身体想说什么。`;
  } else {
    rationale = `孩子选择了「${partLabel}」区域，但没有说太多。SomaKids 会陪家长一起，慢慢帮孩子找到合适的词来形容身体的感觉。`;
  }

  return {
    tags: [...new Set(tags)].slice(0, 5),
    rationale,
  };
}

// ───── 双通道分析 ─────────────────────────────────────────────

function detectEmotions(bodyPart, text) {
  const cleaned = (text || '').trim();
  const scores = {};

  // 通用情绪词（不限部位）
  for (const [kw, info] of Object.entries(UNIVERSAL_EMOTION_MAP)) {
    if (cleaned.includes(kw)) {
      scores[info.emotion] = (scores[info.emotion] || 0) + info.weight;
    }
  }

  // 部位相关情绪词
  const partEmotions = EMOTION_SIGNALS[bodyPart] || [];
  for (const es of partEmotions) {
    const hits = es.keywords.filter((k) => cleaned.includes(k));
    if (hits.length > 0) {
      scores[es.emotion] = (scores[es.emotion] || 0) + hits.length * es.weight;
    }
  }

  // 归一化 confidence（0.45 ~ 0.95）
  return Object.entries(scores)
    .map(([emotion, score]) => ({
      emotion,
      confidence: Math.min(0.95, parseFloat((0.45 + score * 0.28).toFixed(2))),
    }))
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 3);
}

function buildBodySignals(scored) {
  const maxScore = scored[0]?.score || 1;
  return scored
    .filter((s) => s.score > 0)
    .map((s) => ({
      symptom: s.rule.tag,
      confidence: Math.min(
        0.95,
        parseFloat((0.5 + (s.score / maxScore) * 0.45).toFixed(2)),
      ),
    }));
}

function buildEmotionReasoning(emotionSignals, expression, partLabel) {
  if (emotionSignals.length === 0) return null;

  const emotionNames = emotionSignals.map((e) => e.emotion).join('、');
  const expr = (expression || '').trim();

  let text = `有时候小朋友在${emotionNames}的时候，`;
  if (expr) {
    text += `也会说出「${expr}」这样的话。`;
  } else {
    text += `也会觉得${partLabel}不太舒服。`;
  }
  text += `身体的感觉和心里的小情绪常常是连在一起的，`;
  text += `这时候温柔的陪伴，往往比急着找原因更有力量。`;

  return text;
}
