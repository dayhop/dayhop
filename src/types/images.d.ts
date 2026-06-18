declare module '*.jpg' {
  const src: {
    src: string;
    height: number;
    width: number;
    blurDataURL?: string;
  };

  export default src;
}

declare module '*.jpeg' {
  const src: {
    src: string;
    height: number;
    width: number;
    blurDataURL?: string;
  };

  export default src;
}

declare module '*.png' {
  const src: {
    src: string;
    height: number;
    width: number;
    blurDataURL?: string;
  };

  export default src;
}
