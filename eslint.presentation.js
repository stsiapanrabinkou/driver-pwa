// eslint.presentation.js
//
// The Design-in-Code guardrails, as a flat-config FRAGMENT.
//
// This file is APPENDED to the eslint.config.js that SETUP creates — it never
// replaces it. Heads up: the current Vite react-ts template ships oxlint (an
// .oxlintrc.json), NOT eslint, so SETUP removes oxlint and installs the eslint
// baseline (typescript-eslint + react-hooks + react-refresh) this fragment sits
// on top of. Those baseline rules must survive: react-hooks is what catches
// conditional-hook bugs, and `--max-warnings=0` against a config with no real
// rules is a green check that means nothing.
//
// Wiring (see SETUP.md step 9):
//   import { presentationRules } from "./eslint.presentation.js";
//   export default defineConfig([ ...existing, ...presentationRules ]);
//
// Requires: npm i -D eslint-plugin-react

import react from "eslint-plugin-react";

/** Everything a designer owns. Kept in one place — also mirrored in lint-staged. */
const PRESENTATION = [
  "src/shared/ui/**/*.{ts,tsx}",
  "src/features/*/ui/**/*.{ts,tsx}",
  "src/flows/**/*.{ts,tsx}",
  "src/theme/**/*.{ts,tsx}",
  "src/stories/**/*.{ts,tsx}",
];

/**
 * Mantine already ships all of these. Hand-rolling them is the exact thing this
 * kit exists to prevent, so it's an error, not a code-review conversation.
 *
 * `div` and `span` are deliberately NOT here — they're the layout escape hatch
 * (position: fixed wrappers, spacers). Prefer Mantine `Box` / `Flex` / `Group`
 * / `Stack`; reach for a bare div only when there's genuinely nothing to compose.
 *
 * Two elements from the antd version are intentionally NOT banned here, because
 * banning them would fight Mantine's own idioms:
 *   - <form>  — Mantine uses a native <form onSubmit={form.onSubmit(...)}> with
 *               @mantine/form. It's the framework's happy path, not hand-rolling.
 *   - <label> — Mantine inputs take a `label` prop; you almost never write a raw
 *               <label>. Kept banned but pointed at the prop / <Input.Label>,
 *               so the message stays useful rather than fighting you.
 */
const HAND_ROLLED = [
  { element: "button", message: "Use Mantine <Button> / <ActionIcon>." },
  { element: "input", message: "Use Mantine <TextInput> / <NumberInput> / <PasswordInput> / <Checkbox> / <Radio>." },
  { element: "select", message: "Use Mantine <Select> / <NativeSelect> / <MultiSelect>." },
  { element: "textarea", message: "Use Mantine <Textarea>." },
  { element: "label", message: "Use the `label` prop on the Mantine input, or <Input.Label>." },
  { element: "table", message: "Use Mantine <Table> (<Table.Thead>/<Table.Tbody>/<Table.Tr>/<Table.Td>)." },
  { element: "thead", message: "Use Mantine <Table.Thead>." },
  { element: "tbody", message: "Use Mantine <Table.Tbody>." },
  { element: "tfoot", message: "Use Mantine <Table.Tfoot>." },
  { element: "tr", message: "Use Mantine <Table.Tr>." },
  { element: "td", message: "Use Mantine <Table.Td>." },
  { element: "th", message: "Use Mantine <Table.Th>." },
  { element: "ul", message: "Use Mantine <List>." },
  { element: "ol", message: "Use Mantine <List type=\"ordered\">." },
  { element: "li", message: "Use Mantine <List.Item>." },
  { element: "dl", message: "Use Mantine <Table>, a <SimpleGrid> of <Text>, or <DataList> (v9.4+)." },
  { element: "h1", message: "Use Mantine <Title order={1}>." },
  { element: "h2", message: "Use Mantine <Title order={2}>." },
  { element: "h3", message: "Use Mantine <Title order={3}>." },
  { element: "h4", message: "Use Mantine <Title order={4}>." },
  { element: "h5", message: "Use Mantine <Title order={5}>." },
  { element: "h6", message: "Use Mantine <Title order={6}>." },
  { element: "p", message: "Use Mantine <Text>." },
  { element: "a", message: "Use Mantine <Anchor>, or router <Link> for in-app nav." },
  { element: "img", message: "Use Mantine <Image> / <Avatar> / <BackgroundImage>." },
  { element: "hr", message: "Use Mantine <Divider>." },
  { element: "progress", message: "Use Mantine <Progress> / <RingProgress>." },
  { element: "dialog", message: "Use Mantine <Modal> / <Drawer>." },
];

export const presentationRules = [
  // ---------------------------------------------------------------------------
  // 1. No logic in presentation. Data arrives via Props, actions leave via Callbacks.
  // ---------------------------------------------------------------------------
  {
    name: "design-in-code/no-logic-in-presentation",
    files: PRESENTATION,
    rules: {
      "no-restricted-imports": ["error", {
        paths: [
          { name: "axios", message: "No data fetching in presentation. Use Props." },
          { name: "@tanstack/react-query", message: "No React Query in presentation. Use Props." },
          { name: "zustand", message: "No global state in presentation." },
          { name: "zustand/react", message: "No global state in presentation." },
          { name: "zod", message: "Models are dev-owned. A UI component owns its own Props interface." },
          // Navigation is allowed (Link / useNavigate / useParams). Routing LOGIC is not.
          {
            name: "@tanstack/react-router",
            importNames: ["redirect", "useLoaderData", "createRoute", "createRootRoute", "createRouter", "createFileRoute"],
            message: "Navigation only: Link / useNavigate / useParams. Loaders, guards and route wiring live in /app.",
          },
        ],
        // gitignore-style: `**/` so it catches deep + aliased imports, not just siblings.
        patterns: [
          {
            group: [
              "**/api", "**/api/**",
              "**/store", "**/store/**",
              "**/controllers", "**/controllers/**",
              "**/models", "**/models/**",
              "**/app", "**/app/**",
            ],
            message: "UI/flows cannot import from smart layers. Data comes in via Props.",
          },
        ],
      }],
      "no-restricted-globals": [
        "error",
        { name: "fetch", message: "No fetch() in presentation." },
        { name: "XMLHttpRequest", message: "No network calls in presentation." },
      ],
    },
  },

  // Note on what is deliberately ALLOWED in presentation (so it's not banned above):
  //   @mantine/core, @mantine/hooks (useDisclosure, useToggle, …),
  //   @mantine/form   (local form state + validation = the <Form> equivalent),
  //   @mantine/dates, @mantine/notifications, @mantine/modals,
  //   @tabler/icons-react.
  // These are presentation/UX helpers, the Mantine analogues of antd's Form,
  // message/notification/modal — designers legitimately use them.

  // ---------------------------------------------------------------------------
  // 2. Mantine-only. One component library, themed from /src/theme.
  // ---------------------------------------------------------------------------
  {
    name: "design-in-code/mantine-only",
    files: PRESENTATION,
    plugins: { react },
    rules: {
      "react/forbid-elements": ["error", { forbid: HAND_ROLLED }],
      "no-restricted-imports": ["error", {
        paths: [
          { name: "styled-components", message: "Mantine-only: theme via MantineProvider tokens (/src/theme), not CSS-in-JS." },
          { name: "@emotion/react", message: "Mantine-only: theme via MantineProvider tokens (/src/theme)." },
          { name: "@emotion/styled", message: "Mantine-only: theme via MantineProvider tokens (/src/theme)." },
          { name: "@stitches/react", message: "Mantine-only: theme via MantineProvider tokens (/src/theme)." },
        ],
        patterns: [
          // ----------------------------------------------------------------
          // THE ONE DECISION TO REVIEW (see AGENTS.md §2 and SETUP.md).
          //
          // Unlike antd, Mantine ships CSS Modules as a first-class styling
          // path. This kit keeps a SINGLE styling path — co-located
          // *.styles.ts (typed style objects) + Mantine style props — so that
          // every guardrail (incl. the hex ban below, which only sees .ts/.tsx)
          // applies uniformly and there's one obvious way to style a thing.
          //
          // If your team would rather use Mantine-idiomatic CSS Modules, delete
          // this single group. The hex ban won't reach .module.css, so pair it
          // with stylelint if you want colors enforced there too.
          { group: ["*.module.css", "*.module.scss", "*.module.less"], message: "Single styling path: use co-located *.styles.ts + Mantine style props. (Delete this rule to opt into CSS Modules — see AGENTS.md §2.)" },
          // ----------------------------------------------------------------
          { group: ["antd", "antd/**", "@ant-design/**", "bootstrap", "bootstrap/**", "@mui/**", "@chakra-ui/**", "react-bootstrap"], message: "Mantine-only: one component library. Compose from Mantine." },
        ],
      }],
    },
  },

  // ---------------------------------------------------------------------------
  // 3. Tokens, not hex. tokens.ts is the one place raw colors are allowed
  //    (Mantine custom colors are 10-shade hex tuples — they live here).
  // ---------------------------------------------------------------------------
  {
    name: "design-in-code/tokens-not-hardcoded-colors",
    files: PRESENTATION,
    ignores: ["src/theme/tokens.ts"],
    rules: {
      "no-restricted-syntax": ["error", {
        selector: "Literal[value=/^#(?:[0-9a-fA-F]{3,4}){1,2}$/]",
        message: "No hardcoded colors. Read from useMantineTheme() / CSS vars (var(--mantine-color-…)), or add it to /src/theme/tokens.ts.",
      }],
    },
  },
];

export default presentationRules;
