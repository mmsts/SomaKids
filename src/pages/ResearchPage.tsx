import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import { GhostButton } from '../components/GhostButton';

/* ─── Expression Example Data ─── */
const EXPRESSION_EXAMPLES = [
  {
    child: '心里难受',
    possible: ['恶心', '焦虑', '紧张'],
    insight: '孩子说的不是器官，是一种「感受」。',
    gradient: 'linear-gradient(135deg, rgba(255,184,216,0.15), rgba(139,127,232,0.1))',
  },
  {
    child: '肚子要爆炸',
    possible: ['胀痛', '积食', '压力感'],
    insight: '「爆炸」是情绪强度的语言，不是医学描述。',
    gradient: 'linear-gradient(135deg, rgba(168,224,204,0.15), rgba(107,184,255,0.1))',
  },
  {
    child: '胸口堵堵的',
    possible: ['呼吸不舒服', '委屈', '害怕'],
    insight: '身体的不适，常常和心理感受连在一起。',
    gradient: 'linear-gradient(135deg, rgba(255,213,158,0.15), rgba(255,184,160,0.1))',
  },
];

/* ─── Design Principles ─── */
const PRINCIPLES = [
  {
    emoji: '🤲',
    title: '不做医疗诊断',
    desc: 'SomaKids 只是帮你理解孩子的话，真正的判断请交给专业医生。',
  },
  {
    emoji: '💛',
    title: '不制造焦虑',
    desc: '我们不用红色警报吓唬家长。温柔的提醒，比恐慌更有力量。',
  },
  {
    emoji: '👂',
    title: '让儿童感到被理解',
    desc: '孩子需要的不是正确答案，而是「你听懂我了」的确认。',
  },
  {
    emoji: '🌙',
    title: '用陪伴代替分析',
    desc: '冷冰冰的医学报告不如一句「我陪你」来得重要。',
  },
];

/* ─── Flow Steps ─── */
const FLOW_STEPS = [
  { icon: '👆', label: '身体部位', desc: '孩子指出哪里不舒服' },
  { icon: '💬', label: '感受表达', desc: '用孩子自己的语言描述' },
  { icon: '🧠', label: 'AI 理解', desc: '双通道分析身体+情绪' },
  { icon: '💡', label: '家长理解', desc: '温柔翻译，帮助决策' },
];

export function ResearchPage() {
  const navigate = useNavigate();

  return (
    <main className="relative min-h-screen sky-bg stars">
      <div className="relative px-5 sm:px-8 py-12 pb-24 mx-auto max-w-md lg:max-w-5xl">
        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-sm text-ink-tertiary hover:text-ink-primary transition-colors"
          >
            ← 返回首页
          </button>
          <span className="text-[12px] text-ink-tertiary tracking-soft">
            关于 SomaKids
          </span>
        </header>

        {/* ─── Hero ─── */}
        <section className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 h-7 rounded-full bg-white/[0.05] border border-white/[0.08] text-[12px] text-ink-tertiary mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-grad-aurora" />
              研究洞察
            </div>
            <h1 className="text-[32px] lg:text-[48px] font-bold tracking-soft leading-tight">
              孩子说的不是
              <br />
              <span className="bg-grad-aurora bg-clip-text text-transparent">
                「医学术语」
              </span>
            </h1>
            <p className="mt-5 text-[16px] lg:text-[18px] text-ink-secondary leading-relaxed max-w-lg mx-auto">
              SomaKids 研究儿童如何用身体语言表达感受，
              帮助家长跨越「理解鸿沟」。
            </p>
          </motion.div>
        </section>

        {/* ─── Why This Matters ─── */}
        <motion.section
          className="mb-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <SectionLabel>为什么这很重要</SectionLabel>
          <GlassCard radius="xl" size="lg" glow="soft" className="mt-4 relative overflow-hidden">
            <div
              className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-20"
              style={{ background: 'rgba(139, 127, 232, 0.4)' }}
            />
            <div className="relative">
              <blockquote className="text-[22px] lg:text-[28px] font-medium text-ink-primary leading-snug tracking-soft">
                「儿童很多时候，无法准确描述身体感受。
                他们表达的是<span className="text-brand-primary">感受</span>，
                而不是<span className="text-ink-tertiary">医学术语</span>。」
              </blockquote>
              <p className="mt-6 text-[15px] text-ink-secondary leading-relaxed max-w-xl">
                当孩子说「心里难受」时，他们可能正在经历恶心、焦虑、紧张，
                或者三者同时发生。但孩子不会说「我感到焦虑」，
                他们只会说「这里不舒服」。
              </p>
              <p className="mt-4 text-[15px] text-ink-secondary leading-relaxed max-w-xl">
                SomaKids 的使命，就是搭建这座理解的桥梁。
              </p>
            </div>
          </GlassCard>
        </motion.section>

        {/* ─── Real Expression Examples ─── */}
        <motion.section
          className="mb-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <SectionLabel>真实的表达翻译</SectionLabel>
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
            {EXPRESSION_EXAMPLES.map((ex, i) => (
              <motion.div
                key={ex.child}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
              >
                <GlassCard
                  radius="xl"
                  size="md"
                  glow="soft"
                  className="relative overflow-hidden h-full"
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-40"
                    style={{ background: ex.gradient }}
                  />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[13px] text-ink-tertiary font-mono">
                        0{i + 1}
                      </span>
                      <div className="h-px flex-1 bg-white/[0.06]" />
                    </div>

                    <div className="text-[14px] text-ink-tertiary mb-2">
                      孩子表达
                    </div>
                    <div className="text-[20px] font-semibold text-ink-primary leading-snug">
                      「{ex.child}」
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {ex.possible.map((p) => (
                        <span
                          key={p}
                          className="inline-flex items-center px-2.5 h-6 rounded-full bg-white/[0.05] border border-white/[0.08] text-[12px] text-ink-secondary"
                        >
                          {p}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/[0.06]">
                      <p className="text-[13px] text-ink-secondary leading-relaxed">
                        {ex.insight}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ─── Core Insight ─── */}
        <motion.section
          className="mb-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <SectionLabel>核心洞察</SectionLabel>
          <div className="mt-4 text-center py-16 lg:py-20">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <div
                className="inline-block px-8 py-6 rounded-3xl"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 0 60px rgba(139,127,232,0.12)',
                }}
              >
                <p className="text-[24px] lg:text-[32px] font-bold text-ink-primary leading-snug tracking-soft">
                  儿童表达的不是症状，
                  <br />
                  <span className="bg-grad-dawn bg-clip-text text-transparent">
                    而是他们感受到的世界。
                  </span>
                </p>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* ─── AI Translation Flow ─── */}
        <motion.section
          className="mb-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <SectionLabel>SomaKids 如何理解</SectionLabel>
          <GlassCard radius="xl" size="md" glow="soft" className="mt-4">
            <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-2">
              {FLOW_STEPS.map((step, i) => (
                <div key={step.label} className="flex items-center gap-2 w-full lg:w-auto">
                  <motion.div
                    className="flex-1 lg:flex-none flex items-center gap-3 px-5 py-4 rounded-2xl"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                  >
                    <span className="text-[24px]">{step.icon}</span>
                    <div>
                      <div className="text-[14px] font-semibold text-ink-primary">
                        {step.label}
                      </div>
                      <div className="text-[12px] text-ink-tertiary mt-0.5">
                        {step.desc}
                      </div>
                    </div>
                  </motion.div>
                  {i < FLOW_STEPS.length - 1 && (
                    <div className="hidden lg:flex items-center text-ink-tertiary text-[14px] px-1">
                      →
                    </div>
                  )}
                  {i < FLOW_STEPS.length - 1 && (
                    <div className="flex lg:hidden items-center justify-center w-full py-1">
                      <span className="text-ink-tertiary text-[14px]">↓</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.section>

        {/* ─── Design Principles ─── */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <SectionLabel>设计原则</SectionLabel>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PRINCIPLES.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <GlassCard
                  radius="xl"
                  size="sm"
                  glow="soft"
                  className="relative overflow-hidden h-full"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-[24px] shrink-0"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        boxShadow: 'inset 0 0.5px 0 0 rgba(255,255,255,0.1)',
                      }}
                    >
                      {p.emoji}
                    </div>
                    <div>
                      <h4 className="text-[15px] font-semibold text-ink-primary">
                        {p.title}
                      </h4>
                      <p className="mt-1.5 text-[13px] text-ink-secondary leading-relaxed">
                        {p.desc}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Footer CTA */}
        <section className="mt-16 text-center">
          <GhostButton size="lg" onClick={() => navigate('/')}>
            返回首页
          </GhostButton>
        </section>
      </div>
    </main>
  );
}

/* ─── SectionLabel helper ─── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 px-1">
      <span className="w-1 h-4 rounded-full bg-grad-aurora" />
      <span className="text-[13px] font-semibold tracking-[0.06em] text-ink-secondary">
        {children}
      </span>
    </div>
  );
}
