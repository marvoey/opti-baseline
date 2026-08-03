import { OptimizelyGridSection } from '@optimizely/cms-sdk/react/server';
import type { StructureContainerProps, ComponentContainerProps } from '@optimizely/cms-sdk/react/server';
import { ComponentWrapper } from './wrappers';

type BlankSectionProps = {
  content: {
    nodes?: Parameters<typeof OptimizelyGridSection>[0]['nodes'];
  };
};

export default function BlankSection({ content }: BlankSectionProps) {
  return (
    <OptimizelyGridSection
      nodes={content.nodes ?? []}
      ComponentWrapper={ComponentWrapper}
    />
  );
}
