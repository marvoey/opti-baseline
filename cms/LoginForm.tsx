import { contentType, displayTemplate, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { LoginForm as LoginFormWidget } from '@/app/_components/custom/LoginForm';

export const LoginFormContentType = contentType({
  key: 'LoginForm',
  baseType: '_component',
  displayName: 'Login Form',
  description: 'ESL Online Banking sign-in widget with Personal, Business, Investment, and Trust tabs.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {},
});

export const LoginFormDisplayTemplate = displayTemplate({
  key: 'LoginFormDefault',
  isDefault: true,
  displayName: 'Login Form',
  contentType: 'LoginForm',
  settings: {
    alignment: {
      editor: 'select',
      displayName: 'Alignment',
      sortOrder: 0,
      choices: {
        left:   { displayName: 'Left',   sortOrder: 1 },
        center: { displayName: 'Center', sortOrder: 2 },
        right:  { displayName: 'Right',  sortOrder: 3 },
      },
    },
  },
});

type Props = {
  content: ContentProps<typeof LoginFormContentType>;
  displaySettings?: ContentProps<typeof LoginFormDisplayTemplate>;
};

const alignClass: Record<string, string> = {
  left:   'flex justify-start',
  center: 'flex justify-center',
  right:  'flex justify-end',
};

export default function LoginForm({ content, displaySettings }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const align = alignClass[displaySettings?.alignment ?? 'left'];

  return (
    <div {...pa(block)} className={`w-full ${align}`}>
      <LoginFormWidget />
    </div>
  );
}
