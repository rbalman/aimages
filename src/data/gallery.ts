export interface GalleryImageDetails {
  title: string;
  caption: string;
  details: string;
  alt?: string;
}

export const defaultGalleryImageDetails: GalleryImageDetails = {
  title: "AI Image",
  caption: "Generated visual study",
  details: "A personal AI image experiment from Balman Rawat's gallery.",
  alt: "AI generated artwork",
};

export const galleryImageDetails: Record<string, GalleryImageDetails> = {
  "landscape-1.jpg": {
    title: "Landscape Study 01",
    caption: "Atmospheric landscape composition",
    details: "A wide-format AI image study focused on mood, depth, and light.",
    alt: "Atmospheric AI generated landscape",
  },
  "landscape-2.jpg": {
    title: "Landscape Study 02",
    caption: "Cinematic environment exploration",
    details: "A landscape image exploring scale, color, and environmental tone.",
    alt: "Cinematic AI generated landscape",
  },
  "landscape-3.jpg": {
    title: "Landscape Study 03",
    caption: "Wide scene and lighting study",
    details: "A personal AI image experiment with emphasis on composition and light.",
    alt: "Wide AI generated landscape scene",
  },
  "landscape-4.jpg": {
    title: "Landscape Study 04",
    caption: "Scenic image exploration",
    details: "A generated landscape selected for the personal image archive.",
    alt: "Scenic AI generated landscape",
  },
  "portrait-1.jpg": {
    title: "Portrait Study 01",
    caption: "Character and portrait exploration",
    details: "A portrait-oriented AI image study focused on presence and texture.",
    alt: "AI generated portrait study",
  },
  "portrait-2.jpg": {
    title: "Portrait Study 02",
    caption: "Vertical image composition",
    details: "A vertical AI image experiment exploring subject framing and style.",
    alt: "Vertical AI generated image",
  },
  "portrait-3.jpg": {
    title: "Portrait Study 03",
    caption: "Personal portrait-format render",
    details: "A generated portrait-format image from the personal gallery collection.",
    alt: "AI generated portrait format artwork",
  },
  "portrait-4.jpg": {
    title: "Portrait Study 04",
    caption: "Stylized vertical study",
    details: "A portrait image exploring visual style, balance, and detail.",
    alt: "Stylized AI generated portrait",
  },
  "square-1.jpg": {
    title: "Square Study 01",
    caption: "Balanced square-format image",
    details: "A square AI image study composed for quick browsing and detail view.",
    alt: "Square AI generated artwork",
  },
  "square-2.jpg": {
    title: "Square Study 02",
    caption: "Compact visual exploration",
    details: "A personal square-format image selected for the gallery.",
    alt: "Compact square AI generated image",
  },
  "square-3.jpg": {
    title: "Square Study 03",
    caption: "Graphic square composition",
    details: "A generated square image focused on visual impact at thumbnail scale.",
    alt: "Graphic square AI generated artwork",
  },
  "square-4.jpg": {
    title: "Square Study 04",
    caption: "Square image experiment",
    details: "A square-format AI image experiment from Balman Rawat's archive.",
    alt: "Square AI generated image experiment",
  },
};
