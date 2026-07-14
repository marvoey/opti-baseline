# Extract `useOpalChat` hook

## Context
`opal/page.tsx` mixes SSE wiring, payload normalization, policy fetching, and state management directly inside the page component. The same Opal chat loop will eventually be needed in `[[...slug]]/page.tsx`. Extracting a shared hook removes that logic from the page and gives both pages a clean, identical API.

## New file: `app/[locale]/kb-workspace/_hooks/useOpalChat.ts`

Follows the existing `_lib` / `_data` naming convention; scoped to `kb-workspace` where both current and future consumers live.

### What moves in

**Types** (currently at top of `opal/page.tsx`):
- `OpalPayload`
- `PolicyContentWithDebug` (extends `PolicyContent` from `_lib/twoPassResolve.ts`)
- `Message`

**Private helper** — `fetchPolicyContent(lob, topic, jurisdiction?)` (currently a standalone `async function` in the page file)

**State and refs:**
- `messages` state (`useState<Message[]>`)
- `esRef` ref (`useRef<EventSource | null>`)

**Effects:**
- Cleanup effect that closes the EventSource on unmount

**The submit handler** — `handleSubmit` renamed to `submit` for a cleaner public API:
- Creates a UUID, opens the EventSource, POSTs to `/api/opal/trigger`
- Normalises casing of `lob`/`LOB` and `topic`/`Topic` from the Opal payload
- Calls `fetchPolicyContent` when both are resolved
- Handles `onmessage`, `close` event, and `onerror`

### Hook return value

```ts
{
  messages: Message[];
  isLoading: boolean; // derived: messages.some(m => m.loading || m.contentLoading)
  submit: (question: string, knownLob?: string, knownTopic?: string) => Promise<void>;
}
```

`isLoading` stays derived inside the hook — the page just consumes it.

## Updated file: `app/[locale]/kb-workspace/opal/page.tsx`

Remove everything moved to the hook. Import and call `useOpalChat()`. The page keeps:
- `Question` type and `ALL_QUESTIONS` (Combobox-specific)
- `PolicyCard`, `NoContentCard`, `Combobox`, `LightningIcon`, `OpalAvatar` components
- `bottomRef` and the scroll `useEffect` (UI concern, not chat logic)
- JSX render of `OpalPage`

Replace:
```ts
const [messages, setMessages] = useState<Message[]>([]);
const esRef = useRef<EventSource | null>(null);
const isLoading = ...;
// ... handleSubmit ...
```
With:
```ts
const { messages, isLoading, submit } = useOpalChat();
```
And wire `submit` as the `onSubmit` prop of `Combobox` and the retry button.

## Future use in `[[...slug]]/page.tsx`

`KbWorkspaceShell` can later import `useOpalChat` from `../../_hooks/useOpalChat` and call `submit(question)` (without known lob/topic, letting Opal resolve them) to replace the current scripted demo. No changes needed now.

## Verification

1. Run `yarn dev` and open `/kb-workspace/opal`.
2. Submit a question from the combobox — Opal response should load and `PolicyCard` should render as before.
3. Trigger the error path (stop dev API) — error state and Retry button should still work.
4. TypeScript: `yarn tsc --noEmit` should pass with no new errors.
