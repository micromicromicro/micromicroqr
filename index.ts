import qrcode from "qrcode-generator-es6";
import { qrMicro } from "./qr_micro";

export const genericSvgString = ({
  low,
  high,
  addr,
  bg,
  obstructionData = null,
  obstructionPath = null
}: {
    low: Array<number>;
    high: Array<number>;
    addr: string;
    bg?: {
    	enabled: boolean;
	fill?: string;
    };
    obstructionData?: string;
    obstructionPath?: string;
  }): string => {
  let qr = new qrcode(0, "H");
  qr.addData(addr);
  qr.make();
  const obstruction = { width: 0.25, height: 0.25, svgData: null, path: null };
  if (obstructionData) obstruction.svgData = obstructionData;
  else if (obstructionPath) obstruction.path = obstructionPath;
  const svg_data = qr.createSvgTag({
    margin: 0,
    cellColor: (c, r) => {
      const modcount = qr.getModuleCount();
      const interp =
        (Math.pow(c - modcount / 2, 2) + Math.pow(r - modcount / 2, 2)) /
        Math.pow(modcount, 2);
      return (
        "hsl(" +
        (low[0] + (high[0] - low[0]) * interp).toString() +
        ", " +
        (low[1] + (high[1] - low[1]) * interp).toString() +
        "%, " +
        (low[2] + (high[2] - low[2]) * interp).toString() +
        "%" +
        ")"
      );
      },
    bg: bg,
    obstruction: obstruction,
  });
  return svg_data;
};

export const svgString = (addr: string, bg?: {enabled: boolean, fill?: string}): string => {
  return genericSvgString({
    addr: addr,
    low: [119 / 255 * 360, 92 / 255 * 100, 114 / 255 * 100],
    high: [152 / 255 * 360, 79 / 255 * 100, 70 / 255 * 100],
    bg: bg,
    obstructionData: qrMicro
  });
};

export const imgElement = (addr: string, bg?: {enabled: boolean, fill?: string}): HTMLImageElement => {
  const img = document.createElement("img");
  img.src = "data:image/svg+xml;utf-8," + svgString(addr, bg);
  img.alt = "Scan to pay with micromicro!";
  return img
};
