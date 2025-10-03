<div align="center">

# 🤝 Contributing to ReCAPTZ

Thank you for your interest in contributing to ReCAPTZ! We're excited to have you here.

This guide will help you understand our development process and how you can contribute effectively.

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Code of Conduct](https://img.shields.io/badge/code%20of%20conduct-contributor%20covenant-purple.svg?style=flat-square)](CODE_OF_CONDUCT.md)

</div>

---

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [Getting Started](#-getting-started)
- [Development Workflow](#-development-workflow)
- [How to Contribute](#-how-to-contribute)
- [Coding Standards](#-coding-standards)
- [Commit Guidelines](#-commit-guidelines)
- [Pull Request Process](#-pull-request-process)
- [Testing](#-testing)
- [Documentation](#-documentation)
- [Community](#-community)

---

## 📜 Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [shejanmahamud@gmail.com](mailto:shejanmahamud@gmail.com).

### Our Pledge

We are committed to making participation in our project a harassment-free experience for everyone, regardless of:

- Age, body size, disability, ethnicity, gender identity and expression
- Level of experience, education, socio-economic status, nationality
- Personal appearance, race, religion, or sexual identity and orientation

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **pnpm** (v8 or higher) - [Install](https://pnpm.io/installation)
- **Git** - [Download](https://git-scm.com/)

Check your versions:

```bash
node --version  # Should be v18+
pnpm --version  # Should be v8+
git --version
```

### Fork and Clone

1. **Fork the repository** to your GitHub account

   - Click the "Fork" button at the top right of the [repository page](https://github.com/ShejanMahamud/recaptz)

2. **Clone your fork** locally:

```bash
git clone https://github.com/YOUR_USERNAME/recaptz.git
cd recaptz
```

3. **Add upstream remote** to keep your fork synced:

```bash
git remote add upstream https://github.com/ShejanMahamud/recaptz.git
git remote -v  # Verify remotes
```

### Installation

Install project dependencies:

```bash
pnpm install
```

### Development Setup

Start the development server:

```bash
pnpm dev
```

This will start the Vite dev server at `http://localhost:5173` with hot module replacement (HMR).

---

## 🔄 Development Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
# Update your main branch
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feature/your-feature-name

# or for bug fixes
git checkout -b fix/bug-description
```

**Branch Naming Convention:**

| Type          | Format                 | Example                    |
| ------------- | ---------------------- | -------------------------- |
| Feature       | `feature/description`  | `feature/voice-captcha`    |
| Bug Fix       | `fix/description`      | `fix/slider-validation`    |
| Documentation | `docs/description`     | `docs/api-reference`       |
| Refactor      | `refactor/description` | `refactor/captcha-context` |
| Performance   | `perf/description`     | `perf/canvas-rendering`    |
| Tests         | `test/description`     | `test/pattern-captcha`     |

### 2. Make Changes

- Write clean, readable code
- Follow the [coding standards](#-coding-standards)
- Add tests for new features
- Update documentation as needed

### 3. Test Your Changes

Run the test suite:

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

Lint and format your code:

```bash
# Check for linting errors
pnpm lint

# Auto-fix linting issues
pnpm lint:fix

# Format code with Prettier
pnpm format

# Type check
pnpm typecheck
```

### 4. Commit Your Changes

Follow our [commit guidelines](#-commit-guidelines):

```bash
git add .
git commit -m "feat: add voice recognition CAPTCHA"
```

### 5. Push and Create PR

```bash
# Push to your fork
git push origin feature/your-feature-name

# Create a Pull Request on GitHub
```

---

## 🎯 How to Contribute

There are many ways to contribute to ReCAPTZ:

### 🐛 Report Bugs

Found a bug? Help us fix it!

1. Check if the bug is already reported in [Issues](https://github.com/ShejanMahamud/recaptz/issues)
2. If not, create a new issue using the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.md)
3. Provide detailed information:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots/videos if applicable
   - Environment details (OS, browser, Node version)

**Good Bug Report Example:**

```markdown
**Title:** Slider CAPTCHA fails validation on mobile Safari

**Description:**
When using the slider CAPTCHA on iOS Safari 15+, the puzzle piece
doesn't align correctly even when positioned correctly by the user.

**Steps to Reproduce:**

1. Open the demo on iPhone (iOS 15.6, Safari)
2. Attempt slider CAPTCHA
3. Drag piece to correct position
4. Release - validation fails

**Expected:** Validation should succeed when piece is correctly positioned
**Actual:** Always fails validation

**Environment:**

- Device: iPhone 12
- OS: iOS 15.6
- Browser: Safari 15.6
- ReCAPTZ version: 2.0.0
```

### 💡 Suggest Features

Have an idea? We'd love to hear it!

1. Check [existing feature requests](https://github.com/ShejanMahamud/recaptz/issues?q=is%3Aissue+label%3Aenhancement)
2. Create a new issue using the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.md)
3. Explain:
   - The problem you're trying to solve
   - Your proposed solution
   - Alternative solutions considered
   - Additional context or mockups

### 📖 Improve Documentation

Documentation improvements are always welcome:

- Fix typos or clarify confusing sections
- Add more examples and use cases
- Improve API documentation
- Translate documentation to other languages
- Create tutorials or blog posts

### 💻 Code Contributions

Ready to code? Here's what we need:

| Priority  | Area         | Examples                        |
| --------- | ------------ | ------------------------------- |
| 🔴 High   | Bug Fixes    | Critical bugs, security issues  |
| 🟡 Medium | Features     | New CAPTCHA types, improvements |
| 🟢 Low    | Enhancements | UI polish, optimizations        |

Check our [good first issues](https://github.com/ShejanMahamud/recaptz/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) for beginner-friendly tasks.

---

## 📏 Coding Standards

### TypeScript Guidelines

- **Use TypeScript** - All code must be properly typed
- **No `any`** - Use proper types or `unknown` if necessary
- **Interface over Type** - Prefer interfaces for object shapes
- **Explicit Return Types** - Always declare function return types

```tsx
// ✅ Good
interface CaptchaConfig {
  type: CaptchaType;
  length: number;
}

function generateCaptcha(config: CaptchaConfig): string {
  // Implementation
  return captchaText;
}

// ❌ Bad
type CaptchaConfig = any;

function generateCaptcha(config) {
  return captchaText;
}
```

### React Best Practices

- **Functional Components** - Use function components with hooks
- **Named Exports** - Prefer named exports over default
- **Custom Hooks** - Extract reusable logic into custom hooks
- **Memoization** - Use `useMemo` and `useCallback` appropriately

```tsx
// ✅ Good
export const Captcha: React.FC<CaptchaProps> = ({ type, length }) => {
  const config = useMemo(() => ({ type, length }), [type, length]);

  return <div>{/* Component */}</div>;
};

// ❌ Bad
export default function (props: any) {
  const config = { type: props.type, length: props.length };

  return <div>{/* Component */}</div>;
}
```

### Code Style

We use ESLint and Prettier for consistent code formatting:

```bash
# Auto-format your code
pnpm format

# Check for style issues
pnpm lint
```

**Key Style Rules:**

- **2 spaces** for indentation
- **Single quotes** for strings (except JSX)
- **Semicolons** required
- **Trailing commas** in multi-line
- **Arrow functions** preferred
- **Destructuring** when possible

### File Organization

```
src/
├── components/          # React components
│   ├── Captcha.tsx
│   ├── SliderCaptcha.tsx
│   └── PatternCaptcha.tsx
├── hooks/              # Custom React hooks
│   └── useCaptchaState.ts
├── context/            # React Context providers
│   └── CaptchaContext.tsx
├── store/              # Redux store & slices
│   └── slices/
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   └── captchaGenerator.ts
└── index.ts            # Main entry point
```

### Naming Conventions

| Type       | Convention                  | Example           |
| ---------- | --------------------------- | ----------------- |
| Components | PascalCase                  | `PatternCaptcha`  |
| Hooks      | camelCase with `use` prefix | `useCaptchaState` |
| Functions  | camelCase                   | `generateCaptcha` |
| Constants  | UPPER_SNAKE_CASE            | `MAX_ATTEMPTS`    |
| Interfaces | PascalCase                  | `CaptchaConfig`   |
| Types      | PascalCase                  | `CaptchaType`     |

---

## 📝 Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

| Type       | Description             | Example                                 |
| ---------- | ----------------------- | --------------------------------------- |
| `feat`     | New feature             | `feat: add voice recognition CAPTCHA`   |
| `fix`      | Bug fix                 | `fix: resolve slider validation on iOS` |
| `docs`     | Documentation only      | `docs: update API reference`            |
| `style`    | Code style changes      | `style: format with prettier`           |
| `refactor` | Code refactoring        | `refactor: simplify captcha generation` |
| `perf`     | Performance improvement | `perf: optimize canvas rendering`       |
| `test`     | Adding/updating tests   | `test: add pattern CAPTCHA tests`       |
| `chore`    | Maintenance tasks       | `chore: update dependencies`            |
| `ci`       | CI/CD changes           | `ci: add automated tests`               |
| `build`    | Build system changes    | `build: configure vite`                 |

### Scope

Optional, specifies the affected area:

- `captcha` - Main CAPTCHA component
- `slider` - Slider CAPTCHA
- `pattern` - Pattern CAPTCHA
- `math` - Math CAPTCHA
- `audio` - Audio features
- `hooks` - React hooks
- `types` - TypeScript definitions
- `docs` - Documentation

### Examples

```bash
# Feature with scope
feat(pattern): add rotation detection pattern type

# Bug fix with detailed description
fix(slider): correct validation tolerance on mobile devices

The slider CAPTCHA was failing validation on touch devices
due to incorrect pixel offset calculations. This commit
adjusts the tolerance algorithm to account for touch events.

Fixes #123

# Documentation update
docs(readme): add pattern CAPTCHA examples

# Breaking change
feat(api)!: remove server-side mode

BREAKING CHANGE: Server-side validation has been removed.
All validation now happens client-side. See migration guide.
```

### Rules

✅ **Do:**

- Use imperative mood ("add" not "added")
- Keep subject line under 72 characters
- Capitalize first letter of subject
- No period at end of subject
- Reference issues in footer

❌ **Don't:**

- Use past tense
- Add unnecessary punctuation
- Include code in subject line
- Make vague commits ("fix stuff")

---

## 🔀 Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] Tests pass (`pnpm test`)
- [ ] Lint checks pass (`pnpm lint`)
- [ ] Type checking passes (`pnpm typecheck`)
- [ ] Documentation updated
- [ ] CHANGELOG.md updated (for significant changes)
- [ ] Self-review completed

### PR Title

Follow the same format as commit messages:

```
feat(pattern): add size comparison pattern type
```

### PR Description Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Changes Made

- List of changes
- Another change

## Testing

Describe how you tested this

## Screenshots (if applicable)

Add screenshots or videos

## Related Issues

Closes #123

## Checklist

- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
```

### Review Process

1. **Automated Checks** - CI/CD pipeline runs automatically
2. **Code Review** - Maintainers review your code
3. **Feedback** - Address any requested changes
4. **Approval** - PR is approved by maintainers
5. **Merge** - PR is merged into main branch

### Tips for Faster Review

- Keep PRs small and focused (< 400 lines changed)
- Write clear descriptions
- Add screenshots/videos for UI changes
- Respond promptly to feedback
- Keep commits clean and organized

---

## 🧪 Testing

### Test Structure

```
__tests__/
├── components/
│   ├── Captcha.test.tsx
│   ├── SliderCaptcha.test.tsx
│   └── PatternCaptcha.test.tsx
├── hooks/
│   └── useCaptchaState.test.ts
└── utils/
    └── captchaGenerator.test.ts
```

### Writing Tests

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { Captcha } from "../Captcha";

describe("Captcha Component", () => {
  it("should render captcha input", () => {
    render(<Captcha type="numbers" length={4} />);

    expect(screen.getByPlaceholderText(/enter.*code/i)).toBeInTheDocument();
  });

  it("should validate correct input", () => {
    const onValidate = jest.fn();
    render(<Captcha type="numbers" length={4} onValidate={onValidate} />);

    // Test logic
    expect(onValidate).toHaveBeenCalledWith(true);
  });
});
```

### Test Coverage

- Aim for **80%+ coverage** on new code
- All new features must include tests
- Bug fixes should include regression tests

```bash
# Run tests with coverage
pnpm test:coverage
```

---

## 📚 Documentation

### What to Document

- **All Public APIs** - Props, methods, return types
- **Complex Logic** - Explain "why" not just "what"
- **Examples** - Show real-world usage
- **Edge Cases** - Document limitations

### Documentation Style

````tsx
/**
 * Generates a CAPTCHA challenge of specified type and length.
 *
 * @param config - Configuration object for CAPTCHA generation
 * @param config.type - Type of CAPTCHA (numbers, letters, mixed, etc.)
 * @param config.length - Length of the generated CAPTCHA string
 * @returns The generated CAPTCHA text
 *
 * @example
 * ```tsx
 * const captcha = generateCaptcha({ type: 'numbers', length: 4 });
 * console.log(captcha); // "1234"
 * ```
 *
 * @throws {Error} If length is less than 1 or greater than 12
 */
export function generateCaptcha(config: CaptchaConfig): string {
  // Implementation
}
````

---

## 🌟 Community

### Get Help

- 💬 [GitHub Discussions](https://github.com/ShejanMahamud/recaptz/discussions) - Ask questions
- 🐛 [Issue Tracker](https://github.com/ShejanMahamud/recaptz/issues) - Report bugs
- 📧 [Email](mailto:shejanmahamud@gmail.com) - Direct support
- 🐦 [Twitter](https://twitter.com/shejanmahamud) - Follow for updates

### Recognition

Contributors are recognized in:

- README.md contributors section
- Release notes
- Special recognition for significant contributions

### Become a Maintainer

Active contributors may be invited to become maintainers. Maintainers:

- Review and merge PRs
- Triage issues
- Shape project direction
- Mentor new contributors

---

## 🙏 Thank You!

Your contributions make ReCAPTZ better for everyone. Whether it's code, documentation, bug reports, or feature suggestions - every contribution matters.

**Questions?** Don't hesitate to reach out through [Discussions](https://github.com/ShejanMahamud/recaptz/discussions) or [email](mailto:shejanmahamud@gmail.com).

---

<div align="center">

**Happy Contributing! 🎉**

[⬆ Back to Top](#-contributing-to-recaptz)

</div>
