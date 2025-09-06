declare global {
  interface Window {
    electronAPI?: {
      greet: (name: string) => Promise<string>;
      openExternal: (url: string) => void;
      showDialog?: (message: string) => Promise<string>;
    };
  }
}