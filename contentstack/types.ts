export type ImageConnection = {
  edges?: {
    node?: {
      content_type?: string;
      description?: string;
      dimension?: {
        height?: Number;
        width?: Number;
      };
      title?: string;
      filename?: string;
      url: string;
      unique_identifier: string | null;
    };
  }[];
};

export type CallToAction = {
  title: string;
  href: string;
};

export interface Color {
  hsl: {
    h: number;
    s: number;
    l: number;
    a: number;
  };
  hex: string;
  rgb: {
    r: number;
    g: number;
    b: number;
    a: number;
  };
  hsv: {
    h: number;
    s: number;
    v: number;
    a: number;
  };
  oldHue: number;
  source: string;
}
