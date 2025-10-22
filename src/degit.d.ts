declare module 'degit' {
  interface DegitOptions {
    cache?: boolean;
    force?: boolean;
    verbose?: boolean;
  }

  interface Degit {
    clone(dest: string): Promise<void>;
    on(event: string, handler: (info: any) => void): void;
  }

  function degit(src: string, opts?: DegitOptions): Degit;

  export = degit;
}

