import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ChildProfile, HistoryEntry } from '../types';
import { Companion } from '../components/Companion';
import type { ReactNode } from 'react';

interface Props {
  childProfile: ChildProfile;
  onUpdateProfile: (profile: ChildProfile) => void;
}

/* ─── 季节与历史数据 ─── */
const SEASONAL = {
  title: '春季花粉过敏预警',
  emoji: '☀️',
  desc: '最近花粉浓度升高，如果孩子出现打喷嚏、眼睛痒或胸闷，记得减少户外活动，回家及时洗脸换衣。',
};

const MOCK_HISTORY: HistoryEntry[] = [
  { id: '1', part: 'stomach', expression: '咕咕叫', aiTag: '活跃的肠鸣音 · 饥饿感', date: '2026-05-04' },
  { id: '2', part: 'head',    expression: '晕晕的', aiTag: '前庭系统失调 · 短暂眩晕', date: '2026-04-28' },
  { id: '3', part: 'chest',   expression: '闷闷的', aiTag: '胸腔压迫感 · 情绪性反应', date: '2026-04-15' },
];

const PART_ICON: Record<string, string> = { head: '🧠', chest: '❤️', stomach: '🍃' };
const PART_NAME: Record<string, string> = { head: '头部', chest: '胸部', stomach: '胃部' };
const TAG_EMOJI = ['🌿', '🍃', '🌸', '💧', '☁️', '🌙'];

/* ─── 静态弥散光背景（无动画） ─── */
function AuroraOrbs() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ background: '#0a061e' }}
    >
      <div
        className="absolute -top-[10%] -left-[10%] w-[70vw] h-[70vw] rounded-full opacity-30"
        style={{ background: 'rgba(100, 80, 160, 0.30)', filter: 'blur(100px)' }}
      />
      <div
        className="absolute -bottom-[10%] -right-[10%] w-[65vw] h-[65vw] rounded-full opacity-25"
        style={{ background: 'rgba(60, 100, 160, 0.25)', filter: 'blur(80px)' }}
      />
      <div
        className="absolute top-[30%] left-[45%] w-[55vw] h-[55vw] rounded-full opacity-20"
        style={{ background: 'rgba(160, 120, 160, 0.20)', filter: 'blur(80px)' }}
      />
      <div
        className="absolute top-[65%] left-[5%] w-[45vw] h-[45vw] rounded-full opacity-15"
        style={{ background: 'rgba(80, 70, 140, 0.18)', filter: 'blur(60px)' }}
      />
    </div>
  );
}

/* ─── 玻璃卡片（静态、无浮动） ─── */
function GummyCard({
  children,
  radius = '40px',
  shadow,
  className = '',
}: {
  children: ReactNode;
  radius?: string;
  shadow: string;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <div
        className="relative backdrop-blur-2xl"
        style={{
          borderRadius: radius,
          background: 'rgba(255, 255, 255, 0.032)',
          boxShadow: `inset 0 0.5px 0 0 rgba(255,255,255,0.14), ${shadow}`,
        }}
      >
        {/* 顶部柔光高光 */}
        <div
          className="pointer-events-none absolute inset-x-4 top-0 h-px opacity-40"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)',
          }}
        />
        {children}
      </div>
    </div>
  );
}

/* ─── 主按钮（仅保留点击果冻） ─── */
function JellyButton({
  children,
  onClick,
  className = '',
}: {
  children: ReactNode;
  onClick: () => void;
  className?: string;
}) {
  const [popped, setPopped] = useState(false);

  const handleClick = () => {
    setPopped(true);
    setTimeout(() => setPopped(false), 450);
    onClick();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`group relative overflow-hidden rounded-[28px] font-bold tracking-soft text-white transition-transform duration-200 active:scale-[0.96] ${popped ? 'animate-jelly' : ''} ${className}`}
      style={{
        background:
          'radial-gradient(circle at 25% 25%, rgba(168,224,204,0.85) 0%, transparent 45%), ' +
          'radial-gradient(circle at 75% 75%, rgba(139,184,232,0.85) 0%, transparent 45%), ' +
          'radial-gradient(circle at 50% 50%, rgba(164,142,255,0.65) 0%, transparent 55%), ' +
          'linear-gradient(135deg, #7B6BFF 0%, #5DA8FF 50%, #A48EFF 100%)',
        boxShadow:
          '0 8px 28px rgba(123, 107, 255, 0.30), ' +
          'inset 0 1px 1px rgba(255,255,255,0.20), ' +
          'inset 0 -2px 4px rgba(0,0,0,0.06)',
      }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[40%] rounded-t-[28px] bg-gradient-to-b from-white/15 to-transparent" />
      <span className="relative z-10 flex items-center justify-center gap-2 px-10 h-[56px] text-[17px]">
        {children}
      </span>
    </button>
  );
}

/* ─── 对话气泡 ─── */
function SpeechBubble({
  children,
  className = '',
  tail = 'bottom',
}: {
  children: ReactNode;
  className?: string;
  tail?: 'bottom' | 'left' | 'right';
}) {
  const tailCss: Record<string, React.CSSProperties> = {
    bottom: {
      position: 'absolute',
      bottom: '-5px',
      left: '22px',
      width: '10px',
      height: '10px',
      background: 'rgba(255,255,255,0.05)',
      transform: 'rotate(45deg)',
      borderRadius: '1px',
      borderRight: '0.5px solid rgba(255,255,255,0.08)',
      borderBottom: '0.5px solid rgba(255,255,255,0.08)',
    },
    left: {
      position: 'absolute',
      bottom: '14px',
      left: '-5px',
      width: '10px',
      height: '10px',
      background: 'rgba(255,255,255,0.05)',
      transform: 'rotate(45deg)',
      borderRadius: '1px',
      borderLeft: '0.5px solid rgba(255,255,255,0.08)',
      borderBottom: '0.5px solid rgba(255,255,255,0.08)',
    },
    right: {
      position: 'absolute',
      bottom: '14px',
      right: '-5px',
      width: '10px',
      height: '10px',
      background: 'rgba(255,255,255,0.05)',
      transform: 'rotate(45deg)',
      borderRadius: '1px',
      borderRight: '0.5px solid rgba(255,255,255,0.08)',
      borderTop: '0.5px solid rgba(255,255,255,0.08)',
    },
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className="relative backdrop-blur-xl px-4 py-2.5"
        style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '18px 18px 18px 6px',
          boxShadow: 'inset 0 0.5px 0 0 rgba(255,255,255,0.10), 0 4px 16px rgba(0,0,0,0.06)',
        }}
      >
        {children}
      </div>
      <div style={tailCss[tail]} />
    </div>
  );
}

export function HomeView({ childProfile, onUpdateProfile }: Props) {
  const navigate = useNavigate();
  const [editingTag, setEditingTag] = useState<number | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  /* 鼠标跟随微动（幅度已收敛） */
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const handleStart = () => navigate('/body-check');

  const removeTag = (idx: number) => {
    onUpdateProfile({
      ...childProfile,
      medicalHistory: childProfile.medicalHistory.filter((_, i) => i !== idx),
    });
  };

  const addTag = () => {
    const val = tagInput.trim();
    if (!val || childProfile.medicalHistory.includes(val)) return;
    onUpdateProfile({
      ...childProfile,
      medicalHistory: [...childProfile.medicalHistory, val],
    });
    setTagInput('');
    setEditingTag(null);
  };

  const startEdit = (idx: number) => {
    setEditingTag(idx);
    setTagInput(childProfile.medicalHistory[idx]);
  };

  const saveEdit = (idx: number) => {
    const val = tagInput.trim();
    if (!val) { setEditingTag(null); return; }
    const next = [...childProfile.medicalHistory];
    next[idx] = val;
    onUpdateProfile({ ...childProfile, medicalHistory: next });
    setEditingTag(null);
    setTagInput('');
  };

  const cancelEdit = () => { setEditingTag(null); setTagInput(''); };

  const { name, gender, age, medicalHistory } = childProfile;

  const companionOffset = {
    x: mousePos.x * 8,
    y: mousePos.y * 6,
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden stars">
      <AuroraOrbs />

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16 py-10 lg:py-14">
        {/* header */}
        <header className="mb-14 animate-fade-up">
          <h1 className="text-[34px] lg:text-[48px] font-bold tracking-[0.03em] leading-tight">
            嗨，{name}！<span className="inline-block ml-1">✨</span>
          </h1>
          <p className="mt-3 text-[16px] lg:text-[18px] text-ink-secondary tracking-wide">
            今天也是好好照顾身体的一天～
          </p>
        </header>

        <div className="lg:grid lg:grid-cols-[340px_1fr] lg:gap-12">
          {/* ═════ Profile Sidebar ═════ */}
          <aside className="animate-fade-up" style={{ animationDelay: '120ms' }}>
            <GummyCard
              radius="40px 60px 50px 40px"
              shadow="0 20px 48px rgba(255, 184, 216, 0.08), 0 6px 16px rgba(255, 184, 216, 0.04)"
            >
              <div className="p-7 lg:p-8">
                {/* Companion + Bubble — 无绝对定位、无重叠 */}
                <div className="flex flex-col items-center gap-3 lg:flex-row lg:items-center lg:justify-center lg:gap-4">
                  <div
                    style={{
                      transform: `translate(${companionOffset.x}px, ${companionOffset.y}px)`,
                      transition: 'transform 0.35s ease-out',
                    }}
                  >
                    <Companion mood="happy" size={128} />
                  </div>

                  {/* Desktop: bubble to the right */}
                  <div className="hidden lg:block">
                    <SpeechBubble tail="left">
                      <p className="text-[13px] text-ink-primary leading-snug">
                        我是{name}，<br />今年{age}岁啦！
                      </p>
                    </SpeechBubble>
                  </div>

                  {/* Mobile: bubble below */}
                  <div className="lg:hidden">
                    <SpeechBubble tail="bottom">
                      <p className="text-[13px] text-ink-primary whitespace-nowrap leading-snug">
                        我是{name}，今年{age}岁啦！
                      </p>
                    </SpeechBubble>
                  </div>
                </div>

                {/* 性别 / 年龄 pills */}
                <div className="mt-5 flex items-center justify-center gap-2">
                  <span
                    className="inline-flex items-center gap-1.5 px-3.5 h-7 rounded-full text-[12px] text-ink-secondary"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      boxShadow: 'inset 0 0.5px 0 0 rgba(255,255,255,0.08)',
                    }}
                  >
                    {gender === 'boy' ? '👦' : '👧'}
                    <span>{gender === 'boy' ? '男孩' : '女孩'}</span>
                  </span>
                  <span
                    className="inline-flex items-center px-3.5 h-7 rounded-full text-[12px] text-ink-secondary"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      boxShadow: 'inset 0 0.5px 0 0 rgba(255,255,255,0.08)',
                    }}
                  >
                    {age} 岁
                  </span>
                </div>

                {/* 身体标签 */}
                <div
                  className="mt-7 pt-6"
                  style={{ borderTop: '0.5px solid rgba(255,255,255,0.05)' }}
                >
                  <div className="text-[13px] font-bold text-ink-secondary tracking-soft mb-4">
                    🏷️ 我的身体标签
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {medicalHistory.map((tag, i) => (
                      <div key={`${tag}-${i}`}>
                        {editingTag === i ? (
                          <input
                            autoFocus
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onBlur={() => saveEdit(i)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveEdit(i);
                              if (e.key === 'Escape') cancelEdit();
                            }}
                            className="px-3 h-9 rounded-full text-[12px] bg-white/[0.05] border border-brand-primary/25 text-ink-primary outline-none w-28"
                            style={{ boxShadow: 'inset 0 0.5px 0 0 rgba(255,255,255,0.06)' }}
                          />
                        ) : (
                          <button
                            type="button"
                            onClick={() => startEdit(i)}
                            className="inline-flex items-center gap-1.5 px-4 h-9 rounded-full text-[13px] text-emo-calm transition-colors duration-200"
                            style={{
                              background: 'rgba(168, 224, 204, 0.06)',
                              boxShadow: 'inset 0 0.5px 0 0 rgba(255,255,255,0.06)',
                            }}
                          >
                            <span>{TAG_EMOJI[i % TAG_EMOJI.length]}</span>
                            <span>{tag}</span>
                            <span
                              onClick={(e) => { e.stopPropagation(); removeTag(i); }}
                              className="ml-0.5 text-emo-calm/40 hover:text-emo-ache cursor-pointer"
                            >
                              ✕
                            </span>
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => { setEditingTag(-1); setTagInput(''); }}
                      className="px-4 h-9 rounded-full text-[13px] text-ink-tertiary hover:text-ink-primary transition-colors duration-200"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        boxShadow: 'inset 0 0.5px 0 0 rgba(255,255,255,0.06)',
                      }}
                    >
                      + 添加
                    </button>
                  </div>

                  {editingTag === -1 && (
                    <div className="mt-3 flex items-center gap-2">
                      <input
                        autoFocus
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') addTag();
                          if (e.key === 'Escape') cancelEdit();
                        }}
                        placeholder="比如：花粉过敏…"
                        className="flex-1 min-w-0 px-4 h-10 rounded-full text-[13px] bg-white/[0.03] border border-white/[0.06] text-ink-primary placeholder:text-ink-tertiary outline-none focus:border-brand-primary/25"
                        style={{ boxShadow: 'inset 0 0.5px 0 0 rgba(255,255,255,0.04)' }}
                      />
                      <button
                        type="button"
                        onClick={addTag}
                        className="px-5 h-10 rounded-full text-[13px] font-medium text-brand-primary transition-colors duration-200"
                        style={{
                          background: 'rgba(139, 127, 232, 0.10)',
                          boxShadow: 'inset 0 0.5px 0 0 rgba(255,255,255,0.08)',
                        }}
                      >
                        确定
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </GummyCard>
          </aside>

          {/* ═════ Main Content ═════ */}
          <main className="mt-10 lg:mt-0 animate-fade-up" style={{ animationDelay: '240ms' }}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* ─── Quick Start ─── */}
              <div className="lg:col-span-2">
                <GummyCard
                  radius="50px 40px 60px 40px"
                  shadow="0 20px 48px rgba(168, 224, 204, 0.10), 0 6px 16px rgba(168, 224, 204, 0.05)"
                >
                  <div className="relative overflow-hidden min-h-[320px] flex flex-col items-center justify-center text-center p-8 lg:p-12">
                    {/* 静态柔光背景 */}
                    <div
                      className="pointer-events-none absolute inset-0 opacity-10"
                      style={{
                        background: 'radial-gradient(circle at 50% 50%, rgba(168,224,204,0.5), transparent 70%)',
                      }}
                    />

                    <div className="relative z-10">
                      <h3 className="text-[30px] lg:text-[42px] font-bold tracking-[0.02em] leading-tight">
                        嘿！快告诉我
                        <br className="hidden sm:block" />
                        哪里不舒服？
                      </h3>
                      <p className="mt-4 text-[15px] lg:text-base text-ink-secondary leading-relaxed w-full max-w-none">
                        点一点、说一说，SomaKids 会帮你把身体的话翻译给爸爸妈妈听。
                      </p>
                      <div className="mt-10">
                        <JellyButton onClick={handleStart}>
                          开始感受 <span className="text-[20px]">✨</span>
                        </JellyButton>
                      </div>
                    </div>
                  </div>
                </GummyCard>
              </div>

              {/* ─── Seasonal Insight ─── */}
              <div>
                <GummyCard
                  radius="40px 50px 40px 60px"
                  shadow="0 20px 48px rgba(255, 200, 140, 0.08), 0 6px 16px rgba(255, 200, 140, 0.04)"
                  className="h-full"
                >
                  <div className="relative h-full p-7 overflow-hidden">
                    {/* 背景装饰 Emoji */}
                    <span
                      className="pointer-events-none absolute -bottom-8 -right-8 text-[120px] opacity-[0.05] select-none"
                    >
                      {SEASONAL.emoji}
                    </span>

                    {/* 静态 3D 发光图标 */}
                    <div className="relative mb-5">
                      <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center text-[22px]"
                        style={{
                          background: 'rgba(255, 200, 140, 0.08)',
                          boxShadow:
                            'inset 0 0.5px 0 0 rgba(255,255,255,0.10), ' +
                            '0 4px 16px rgba(255, 200, 140, 0.08)',
                          filter: 'drop-shadow(0 0 10px rgba(255, 200, 100, 0.25))',
                        }}
                      >
                        {SEASONAL.emoji}
                      </div>
                    </div>

                    <div className="relative z-10">
                      <span className="text-[12px] font-bold text-ink-secondary tracking-soft uppercase">
                        季节提醒
                      </span>
                      <h4 className="mt-2 text-[20px] font-bold text-ink-primary leading-snug tracking-tight">
                        {SEASONAL.title}
                      </h4>
                      <p className="mt-3 text-[13.5px] text-ink-secondary leading-relaxed">
                        {SEASONAL.desc}
                      </p>
                    </div>
                  </div>
                </GummyCard>
              </div>

              {/* ─── History List ─── */}
              <div className="lg:col-span-3">
                <GummyCard
                  radius="50px 40px 40px 60px"
                  shadow="0 20px 48px rgba(164, 142, 255, 0.07), 0 6px 16px rgba(164, 142, 255, 0.03)"
                >
                  <div className="p-7 lg:p-8">
                    <div className="flex items-center gap-2.5 mb-6">
                      <span className="w-2 h-2 rounded-full bg-grad-aurora" />
                      <span className="text-[14px] font-bold text-ink-secondary tracking-soft">
                        最近记录
                      </span>
                    </div>

                    <div className="flex flex-col">
                      {MOCK_HISTORY.map((h, i) => (
                        <div
                          key={h.id}
                          className="group flex items-center gap-4 py-4 animate-fade-up cursor-pointer transition-colors duration-200"
                          style={{
                            animationDelay: `${400 + i * 120}ms`,
                            borderBottom:
                              i < MOCK_HISTORY.length - 1
                                ? '0.5px solid rgba(255,255,255,0.03)'
                                : 'none',
                          }}
                        >
                          <div
                            className="w-11 h-11 rounded-full flex items-center justify-center text-[20px] shrink-0"
                            style={{
                              background: 'rgba(255,255,255,0.03)',
                              boxShadow: 'inset 0 0.5px 0 0 rgba(255,255,255,0.05)',
                            }}
                          >
                            {PART_ICON[h.part]}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2.5">
                              <span className="text-[15px] font-bold text-ink-primary">
                                {PART_NAME[h.part]}
                              </span>
                              <span
                                className="text-[11px] text-ink-tertiary font-mono px-2 h-5 rounded-full flex items-center"
                                style={{ background: 'rgba(255,255,255,0.02)' }}
                              >
                                {h.date}
                              </span>
                            </div>
                            <div className="mt-0.5 text-[13px] text-ink-secondary truncate">
                              「{h.expression}」→ {h.aiTag}
                            </div>
                          </div>

                          <div className="hidden sm:flex items-center gap-1 text-[12px] text-ink-tertiary group-hover:text-brand-primary transition-colors shrink-0">
                            查看
                            <span>→</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </GummyCard>
              </div>
            </div>
          </main>
        </div>
      </div>
    </main>
  );
}
