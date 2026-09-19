import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Scale, ShieldCheck, FileText, Activity } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
  category: 'pericia' | 'clinica' | 'seguranca';
  icon: React.ReactNode;
}

const FAQ_ITEMS: FAQItemProps[] = [
  {
    category: 'pericia',
    icon: <Scale size={16} className="text-[#B5A475]" />,
    question: "Qual é a diferença entre perícia judicial e assistência técnica médica?",
    answer: "O perito judicial é nomeado pelo juízo e deve atuar com imparcialidade dentro do objeto definido no processo. O assistente técnico é indicado por uma das partes. São funções diferentes, com responsabilidades e limites próprios."
  },
  {
    category: 'pericia',
    icon: <FileText size={16} className="text-[#B5A475]" />,
    question: "O que é necessário para uma análise médico-legal inicial?",
    answer: "O ponto de partida é definir o objeto da análise e identificar quais documentos realmente respondem à pergunta técnica. Prontuários, exames, laudos anteriores, quesitos e cronologia podem ser relevantes, mas a necessidade de cada item depende do caso."
  },
  {
    category: 'clinica',
    icon: <Activity size={16} className="text-[#B5A475]" />,
    question: "Como funciona uma consulta médica?",
    answer: "A consulta parte da história clínica, antecedentes, medicamentos, exame físico quando aplicável e documentos disponíveis. Conduta, necessidade de investigação e seguimento dependem da avaliação individual, sem pacotes ou promessas de resultado."
  },
  {
    category: 'seguranca',
    icon: <ShieldCheck size={16} className="text-[#B5A475]" />,
    question: "Posso enviar dados médicos ou documentos judiciais por qualquer área deste site?",
    answer: "Não. A versão pública do site não deve ser usada para publicar ou compartilhar dados sensíveis sem um canal previamente autorizado. Documentos clínicos e judiciais exigem tratamento compatível com sigilo profissional e proteção de dados."
  },
  {
    category: 'seguranca',
    icon: <ShieldCheck size={16} className="text-[#B5A475]" />,
    question: "As ferramentas digitais substituem avaliação médica ou conclusão pericial?",
    answer: "Não. Ferramentas digitais podem organizar informações, cálculos e fluxos, mas a interpretação e a conclusão dependem de contexto, documentação, método e julgamento profissional."
  }
];

export const FAQAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'pericia' | 'clinica'>('all');

  const filteredItems = FAQ_ITEMS.filter(item =>
    activeCategory === 'all' ? true : item.category === activeCategory
  );

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-stone-50/50 dark:bg-stone-950/20 border-t border-stone-200/50 dark:border-stone-900/60 py-20 px-6 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-[10px] uppercase font-mono tracking-widest bg-[#B5A475]/10 dark:bg-[#B5A475]/5 text-[#B5A475] px-4 py-1.5 rounded-full border border-[#B5A475]/15 font-bold inline-flex items-center gap-2">
            <ShieldCheck size={12} /> Informações profissionais
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-stone-900 dark:text-stone-50 font-normal tracking-tight">
            Perguntas frequentes
          </h2>
          <p className="text-stone-500 dark:text-stone-400 text-xs max-w-lg mx-auto leading-relaxed">
            Informações gerais sobre atendimento médico, perícia e uso responsável das ferramentas digitais.
          </p>
        </div>

        <div className="flex justify-center gap-2 max-w-md mx-auto p-1 bg-stone-100 dark:bg-stone-900/40 rounded-xl border border-stone-200/40 dark:border-stone-850">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'pericia', label: 'Perícia' },
            { id: 'clinica', label: 'Clínica' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id as any);
                setOpenIndex(null);
              }}
              className={`flex-1 py-1.5 px-3 text-[10px] font-extrabold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-sm font-black'
                  : 'text-stone-550 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {filteredItems.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <motion.div
                  key={item.question}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className={`bg-white dark:bg-stone-900/60 border rounded-2xl transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? 'border-[#B5A475]/40 shadow-md ring-1 ring-[#B5A475]/10'
                      : 'border-stone-200/60 dark:border-stone-850 hover:border-stone-300 dark:hover:border-stone-800'
                  }`}
                >
                  <button
                    onClick={() => toggleItem(idx)}
                    className="w-full flex items-center justify-between p-5 md:p-6 text-left cursor-pointer transition-colors duration-200"
                  >
                    <div className="flex items-center gap-4 pr-4">
                      <div className={`p-2 rounded-xl border transition-colors ${
                        isOpen
                          ? 'bg-[#B5A475]/10 border-[#B5A475]/25 text-[#B5A475]'
                          : 'bg-stone-50 dark:bg-stone-950 border-stone-200/60 dark:border-stone-850 text-stone-450'
                      }`}>
                        {item.icon}
                      </div>
                      <span className="font-serif text-sm md:text-base text-stone-900 dark:text-stone-100 leading-tight font-medium">
                        {item.question}
                      </span>
                    </div>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="text-stone-400 dark:text-stone-600"
                    >
                      <ChevronDown size={18} />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="px-5 pb-6 md:px-16 md:pb-7 text-xs md:text-sm text-stone-600 dark:text-stone-300 font-sans leading-relaxed border-t border-stone-100 dark:border-stone-850 pt-4">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
