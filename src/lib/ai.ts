import type { BodyPart, Symptom } from '../types';

export const BODY_LABEL: Record<BodyPart, string> = {
  head: '头',
  chest: '胸口',
  stomach: '肚子',
};

export const BODY_GENTLE_QUESTION: Record<BodyPart, string> = {
  head: '你的小脑袋,现在在告诉你什么呢?',
  chest: '胸口的小心脏,现在是什么感觉呢?',
  stomach: '肚子里现在,藏着什么样的感觉呢?',
};

const SYMPTOMS: Record<BodyPart, Symptom[]> = {
  head: [
    {
      id: 'headache',
      label: '头痛痛的',
      guess: '是不是头有一点点痛,像被一只手轻轻捏住?',
      emoToken: 'ache',
      metaphor: '头里像有一团云,沉沉地停在那儿',
      causes: [
        '可能是看屏幕看久了',
        '可能是没睡够',
        '可能是太热或太吵了',
      ],
      keywords: ['痛', '疼', '胀', '沉', '锤', '捏', '砰'],
      suggestions: [
        {
          level: 1,
          emoji: '🌬️',
          title: '闭上眼,慢慢呼吸',
          detail: '吸气 4 秒,呼气 6 秒,试 5 次',
        },
        {
          level: 2,
          emoji: '🛏️',
          title: '把灯调暗,安静躺一会儿',
          detail: '10 分钟就好,什么都不用想',
        },
        {
          level: 3,
          emoji: '🤝',
          title: '告诉爸爸妈妈',
          detail: '如果痛了很久,要让大人知道',
        },
      ],
    },
    {
      id: 'dizzy',
      label: '晕晕的',
      guess: '是不是有一点点晕,像坐在转椅上?',
      emoToken: 'tired',
      metaphor: '世界好像在轻轻地转圈',
      causes: [
        '可能是站起来太快了',
        '可能是有一会儿没吃东西',
        '可能是太累了',
      ],
      keywords: ['晕', '转', '飘', '晃', '摇', '不稳'],
      suggestions: [
        {
          level: 1,
          emoji: '🪑',
          title: '慢慢坐下来',
          detail: '看看远处一棵树或一朵云,数到 10',
        },
        {
          level: 2,
          emoji: '💧',
          title: '喝几小口温水',
          detail: '一口一口慢慢咽',
        },
        {
          level: 3,
          emoji: '🤝',
          title: '请大人陪你',
          detail: '一直晕的话不要自己走来走去',
        },
      ],
    },
    {
      id: 'heavyhead',
      label: '闷闷的',
      guess: '是不是脑袋里闷闷的,装着说不出来的东西?',
      emoToken: 'sad',
      metaphor: '脑袋里像塞了一团软软的棉花',
      causes: ['也许有事情让你担心', '也许是想了好多好多遍'],
      keywords: ['闷', '重', '想哭', '烦', '乱', '堵'],
      suggestions: [
        {
          level: 1,
          emoji: '🎨',
          title: '把心里的东西画出来',
          detail: '不一定要画得像,乱涂也可以',
        },
        {
          level: 2,
          emoji: '🪟',
          title: '看看窗外,深呼吸',
          detail: '让眼睛和脑袋都歇一会儿',
        },
        {
          level: 3,
          emoji: '💬',
          title: '找个信任的大人说说',
          detail: '说出来,云就会散一点点',
        },
      ],
    },
  ],
  chest: [
    {
      id: 'racing',
      label: '心跳很快',
      guess: '是不是心跳得很快,像有一只小鼓在敲?',
      emoToken: 'anxious',
      metaphor: '心里有一只小兔子在跑',
      causes: [
        '也许刚刚跑过',
        '也许是有点紧张',
        '也许是开心或激动过头啦',
      ],
      keywords: ['跳', '快', '砰', '怦', '鼓', '急'],
      suggestions: [
        {
          level: 1,
          emoji: '🤲',
          title: '把手放在心口',
          detail: '慢慢吸气、慢慢呼气,陪小兔子歇一歇',
        },
        {
          level: 2,
          emoji: '🪷',
          title: '找个安静的地方坐 5 分钟',
          detail: '不需要做什么,就听自己的呼吸',
        },
        {
          level: 3,
          emoji: '🤝',
          title: '告诉大人',
          detail: '如果一直跳得很快,要让大人知道',
        },
      ],
    },
    {
      id: 'tightchest',
      label: '紧紧的',
      guess: '是不是胸口紧紧的,像压着一块软软的石头?',
      emoToken: 'sad',
      metaphor: '胸口像被一只柔软的手轻轻按住',
      causes: ['也许有委屈藏在心里', '也许是想哭还没哭出来'],
      keywords: ['紧', '压', '闷', '重', '堵', '憋'],
      suggestions: [
        {
          level: 1,
          emoji: '🌬️',
          title: '大口呼出气',
          detail: '把胸口里的气都吐光,再慢慢吸回来',
        },
        {
          level: 2,
          emoji: '🧸',
          title: '抱抱自己,或抱抱玩偶',
          detail: '紧紧抱 30 秒,告诉自己:我在这里',
        },
        {
          level: 3,
          emoji: '💬',
          title: '跟一个你信任的人说说',
          detail: '不要一个人扛',
        },
      ],
    },
    {
      id: 'sadheart',
      label: '酸酸的',
      guess: '是不是心里酸酸的,有一点点想哭?',
      emoToken: 'sad',
      metaphor: '心里下着一场小小的雨',
      causes: ['也许受了一点委屈', '也许是想念某个人或某件事'],
      keywords: ['酸', '难过', '哭', '委屈', '想'],
      suggestions: [
        {
          level: 1,
          emoji: '💧',
          title: '想哭就哭一会儿',
          detail: '眼泪是身体送给你的好朋友',
        },
        {
          level: 2,
          emoji: '🎨',
          title: '画一幅画送给现在的自己',
          detail: '什么颜色都可以',
        },
        {
          level: 3,
          emoji: '🤝',
          title: '告诉爸爸妈妈或老师',
          detail: '他们会陪你一起,雨就会慢慢停',
        },
      ],
    },
  ],
  stomach: [
    {
      id: 'nausea',
      label: '想吐',
      guess: '是不是有一点点想吐,胃里翻翻的?',
      emoToken: 'ache',
      metaphor: '肚子里像有一片小海浪在翻',
      causes: [
        '也许是吃得太快了',
        '也许是肚子受了一点凉',
        '也许是太紧张',
      ],
      keywords: ['吐', '反胃', '恶心', '翻', '涌'],
      suggestions: [
        {
          level: 1,
          emoji: '💧',
          title: '慢慢喝几小口温水',
          detail: '一口一口,陪海浪平静下来',
        },
        {
          level: 2,
          emoji: '🪑',
          title: '坐下来,深呼吸',
          detail: '不要立刻动,身体需要一点时间',
        },
        {
          level: 3,
          emoji: '🤝',
          title: '告诉大人',
          detail: '一直想吐就一定要让大人知道',
        },
      ],
    },
    {
      id: 'tummyache',
      label: '肚子痛',
      guess: '是不是肚子痛痛的,像被轻轻拧了一下?',
      emoToken: 'ache',
      metaphor: '肚子里像住了一只小刺猬',
      causes: ['也许吃了凉东西', '也许肚子里有气', '也许是想去厕所'],
      keywords: ['痛', '疼', '绞', '刀', '抽', '拧'],
      suggestions: [
        {
          level: 1,
          emoji: '🤲',
          title: '用手心暖暖肚子',
          detail: '顺时针轻轻揉 30 圈',
        },
        {
          level: 2,
          emoji: '🚪',
          title: '试试去趟厕所',
          detail: '有时候肚子只是想说这件事',
        },
        {
          level: 3,
          emoji: '🤝',
          title: '痛超过半小时,告诉大人',
          detail: '不要一个人忍着',
        },
      ],
    },
    {
      id: 'butterfly',
      label: '紧张',
      guess: '是不是肚子里像有蝴蝶在飞,紧张紧张的?',
      emoToken: 'anxious',
      metaphor: '肚子里有好多小翅膀在轻轻扑',
      causes: ['可能要面对一件不太确定的事', '可能心里装着一个小秘密'],
      keywords: ['紧张', '飞', '蝴蝶', '怕', '担心', '翻'],
      suggestions: [
        {
          level: 1,
          emoji: '🤲',
          title: '双手捂肚子,告诉自己:我会没事的',
          detail: '慢慢说三遍,身体在听',
        },
        {
          level: 2,
          emoji: '🎨',
          title: '把让你紧张的事画出来',
          detail: '看见它,蝴蝶就会变小',
        },
        {
          level: 3,
          emoji: '💬',
          title: '跟大人说说',
          detail: '说出来,会比想象中容易很多',
        },
      ],
    },
    {
      id: 'bloat',
      label: '胀胀的',
      guess: '是不是肚子鼓鼓的、胀胀的?',
      emoToken: 'tired',
      metaphor: '肚子像装了一个小气球',
      causes: ['也许吃太饱', '也许喝得太快有空气进去', '也许是想去厕所'],
      keywords: ['胀', '撑', '鼓', '满', '硬'],
      suggestions: [
        {
          level: 1,
          emoji: '🚶',
          title: '慢慢站起来,走两圈',
          detail: '让小气球慢慢消下去',
        },
        {
          level: 2,
          emoji: '🤲',
          title: '顺时针揉揉肚子',
          detail: '轻轻地,像安慰一只小猫',
        },
        {
          level: 3,
          emoji: '🤝',
          title: '一直不舒服就告诉大人',
          detail: '别忍着',
        },
      ],
    },
    {
      id: 'hungry',
      label: '饿了',
      guess: '是不是有一点点饿啦,肚子在咕咕叫?',
      emoToken: 'joy',
      metaphor: '肚子像在轻轻打鼓,在叫你来吃饭',
      causes: ['离上次吃饭可能有一会儿了', '也可能是身体在长大,需要能量'],
      keywords: ['饿', '空', '咕咕', '没吃'],
      suggestions: [
        {
          level: 1,
          emoji: '💧',
          title: '先喝一小口水',
          detail: '告诉大人:我有点饿啦',
        },
        {
          level: 2,
          emoji: '🍎',
          title: '找一个健康小零食',
          detail: '水果、牛奶、坚果都很好',
        },
        {
          level: 3,
          emoji: '🤝',
          title: '如果总是很饿,告诉爸爸妈妈',
          detail: '可能是该好好吃一顿了',
        },
      ],
    },
  ],
};

export const UNSURE_SYMPTOM: Symptom = {
  id: 'unsure',
  label: '说不太清楚的不舒服',
  guess: '',
  emoToken: 'tired',
  metaphor: '身体在悄悄说一句话,只是还没找到合适的词',
  causes: ['这很正常,身体的感觉常常是悄悄的'],
  keywords: [],
  suggestions: [
    {
      level: 1,
      emoji: '🌬️',
      title: '先深呼吸一下',
      detail: '吸气 4 秒,慢慢呼出去 6 秒,试 3 次',
    },
    {
      level: 2,
      emoji: '🛋️',
      title: '找个最舒服的地方坐一会儿',
      detail: '不用做什么,让身体安静地待着',
    },
    {
      level: 3,
      emoji: '🤝',
      title: '把这种感觉告诉一个大人',
      detail: '说不清楚没关系,大人会陪你一起找',
    },
  ],
};

export function rankSymptoms(part: BodyPart, expression: string): Symptom[] {
  const text = expression.trim();
  if (!text) return [...SYMPTOMS[part]];
  return [...SYMPTOMS[part]]
    .map((s) => ({
      s,
      score: s.keywords.reduce((n, k) => (text.includes(k) ? n + 1 : n), 0),
    }))
    .sort((a, b) => b.score - a.score)
    .map(({ s }) => s);
}

function findKeywordHit(symptom: Symptom, expression: string): string | null {
  for (const k of symptom.keywords) {
    if (expression.includes(k)) return k;
  }
  return null;
}

export function buildUnderstanding(
  part: BodyPart,
  expression: string,
  symptom: Symptom,
): string {
  const partLabel = BODY_LABEL[part];
  if (symptom.id === 'unsure') {
    const said = expression.trim();
    if (said) {
      return `你说"${said}"——这个感觉,${symptom.metaphor}。我们可以先慢一点,身体不急。`;
    }
    return `你的${partLabel}有些感觉,但还说不清楚——${symptom.metaphor}。这没关系,我们可以慢慢来。`;
  }
  const matched = findKeywordHit(symptom, expression);
  const cause = symptom.causes[0];
  if (matched) {
    return `你说${partLabel}「${matched}」——听起来像是${symptom.label}的感觉。${symptom.metaphor}。${cause}。`;
  }
  const said = expression.trim();
  if (said) {
    return `你说"${said}"——听起来你的${partLabel}在告诉你:${symptom.metaphor}。${cause}。`;
  }
  return `你的${partLabel}有点不舒服,像${symptom.label}的感觉。${symptom.metaphor}。${cause}。`;
}
