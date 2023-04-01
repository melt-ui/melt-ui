import 'jest-axe/extend-expect';

import { expect, vi } from 'vitest';

import matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);
