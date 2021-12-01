export interface IBackendContext {
  dirs: {
    build: string;
    root: string;
    dirname: string;
    functions: string;
  };
  names: {
    build: string;
  };
  files: Array<{
    name: string;
    path: string;
  }>;
}
