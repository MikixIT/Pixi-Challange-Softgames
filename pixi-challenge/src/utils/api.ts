export interface MagicWordMessage {
  name: string;
  text: string;
}

interface Avatar {
  name: string;
  url: string;
  position: "left" | "right";
}

interface Emoji {
  name: string;
  url: string;
}

export interface MagicWordApiResponse {
  dialogue: MagicWordMessage[];
  emojies: Emoji[];
  avatars: Avatar[];
}

export async function fetchDialogueData(): Promise<MagicWordApiResponse> {
  const res = await fetch(
    "https://private-624120-softgamesassignment.apiary-mock.com/v2/magicwords"
  );
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  const data: MagicWordApiResponse = await res.json();
  return data;
}
