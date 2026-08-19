import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { Check, Circle, ArrowRight } from 'lucide-react';

export const StepperBlockContentType = contentType({
  key: 'StepperBlock',
  baseType: '_component',
  displayName: 'Stepper Container',
  description: 'Main container for step-by-step components.',
  compositionBehaviors: ['sectionEnabled', 'elementEnabled'],
  properties: {
    Heading: {
      type: 'string',
      displayName: 'Heading',
      sortOrder: 10,
    },
    Description: {
      type: 'string',
      displayName: 'Description',
      sortOrder: 20,
    },
    StepperStyle: {
      type: 'string',
      displayName: 'Stepper Style',
      sortOrder: 30,
      enum: [
        { value: 'Horizontal', displayName: 'Horizontal' },
        { value: 'Vertical', displayName: 'Vertical' },
        { value: 'ProgressBar', displayName: 'Progress Bar' },
      ],
    },
    CurrentStep: {
      type: 'integer',
      displayName: 'Current Step Override',
      description: 'Forces a specific step to be active. If left blank/0, frontend handles it.',
      sortOrder: 40,
    },
    Steps: {
      type: 'array',
      displayName: 'Steps',
      sortOrder: 50,
      items: {
        type: 'richText',
      },
    },
  },
});

type StepRichText = { html?: string | null };

type Props = { content: ContentProps<typeof StepperBlockContentType> };

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function HorizontalStepper({ steps, currentStep }: { steps: StepRichText[]; currentStep: number }) {
  const total = steps.length;
  const progressPct = total > 1 ? ((currentStep - 1) / (total - 1)) * 100 : 0;

  return (
    <div className="flex items-center justify-between relative mb-8">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 rounded-full" />
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 rounded-full transition-all duration-300"
        style={{ width: `${progressPct}%` }}
      />
      {steps.map((step, index) => {
        const isCompleted = index < currentStep - 1;
        const isActive = index === currentStep - 1;
        const isUpcoming = index > currentStep - 1;
        const label = step.html ? stripHtml(step.html) : `Step ${index + 1}`;
        return (
          <div key={index} className="relative z-10 flex flex-col items-center group">
            <div
              className={[
                'w-10 h-10 rounded-full flex items-center justify-center border-2 bg-white transition-colors duration-300',
                isCompleted ? 'border-blue-600 bg-blue-600 text-white' : '',
                isActive ? 'border-blue-600 text-blue-600' : '',
                isUpcoming ? 'border-slate-300 text-slate-400' : '',
              ].join(' ')}
            >
              {isCompleted ? <Check className="w-5 h-5" /> : <span>{index + 1}</span>}
            </div>
            <span
              className={[
                'mt-3 text-sm font-medium absolute -bottom-7 w-32 text-center truncate',
                isActive ? 'text-blue-600' : 'text-slate-500',
              ].join(' ')}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function VerticalStepper({ steps, currentStep }: { steps: StepRichText[]; currentStep: number }) {
  return (
    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-slate-200 before:via-slate-200 before:to-transparent">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep - 1;
        const isActive = index === currentStep - 1;
        return (
          <div
            key={index}
            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
          >
            <div
              className={[
                'flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10',
                isCompleted ? 'bg-emerald-500' : isActive ? 'bg-blue-500 ring-4 ring-blue-50' : 'bg-slate-300',
              ].join(' ')}
            >
              {isCompleted ? (
                <Check className="w-4 h-4 text-white" />
              ) : (
                <Circle
                  className={`w-3 h-3 ${isActive ? 'text-white' : 'text-slate-400'}`}
                  fill="currentColor"
                />
              )}
            </div>
            <div
              className={[
                'w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-xl border shadow-sm transition-all duration-300',
                isActive ? 'border-blue-200 bg-blue-50/50' : 'border-slate-100 bg-slate-50/50',
              ].join(' ')}
            >
              <div
                className={`prose prose-sm max-w-none ${isActive ? 'prose-blue' : 'prose-slate'}`}
                dangerouslySetInnerHTML={{ __html: step.html ?? '' }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ProgressBarStepper({ steps, currentStep }: { steps: StepRichText[]; currentStep: number }) {
  const total = steps.length;
  const progress = total > 1 ? ((currentStep - 1) / (total - 1)) * 100 : 0;

  return (
    <>
      <div className="mb-6">
        <div className="flex justify-between mb-3">
          <span className="text-sm font-semibold text-indigo-600 tracking-wide uppercase">
            Step {currentStep} of {total}
          </span>
          <span className="text-sm font-medium text-slate-500">{Math.round(progress)}% Completed</span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div
        className="grid gap-4 text-center text-sm font-medium"
        style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}
      >
        {steps.map((step, index) => (
          <div
            key={index}
            className={`transition-colors duration-300 ${index < currentStep ? 'text-slate-800' : 'text-slate-400'}`}
          >
            {step.html ? stripHtml(step.html) : `Step ${index + 1}`}
          </div>
        ))}
      </div>
    </>
  );
}

export default function StepperBlock({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;

  const steps = (content.Steps ?? []) as StepRichText[];
  const currentStep = content.CurrentStep && content.CurrentStep > 0 ? content.CurrentStep : 1;
  const style = (content.StepperStyle ?? 'Horizontal').trim().toLowerCase().replace(/[_\s-]/g, '');

  return (
    <div {...pa(block)} className="w-full max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-slate-100">
      {content.Heading && (
        <h3 {...pa('Heading')} className="text-lg font-semibold text-slate-800 mb-2">
          {content.Heading}
        </h3>
      )}
      {content.Description && (
        <p {...pa('Description')} className="text-sm text-slate-500 mb-6">
          {content.Description}
        </p>
      )}

      <div {...pa('Steps')} className={style === 'horizontal' ? 'mt-8 mb-12' : ''}>
        {style === 'vertical' ? (
          <VerticalStepper steps={steps} currentStep={currentStep} />
        ) : style === 'progressbar' ? (
          <ProgressBarStepper steps={steps} currentStep={currentStep} />
        ) : (
          <HorizontalStepper steps={steps} currentStep={currentStep} />
        )}
      </div>

      {style === 'horizontal' && (
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition-colors">
            Back
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2">
            Next <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
