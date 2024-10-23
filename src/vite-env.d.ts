/// <reference types="vite/client" />

declare module '*.svg' {
  import type * as React from 'react';
  const content: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default content;
}
