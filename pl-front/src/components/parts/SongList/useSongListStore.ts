import { create } from "zustand";
import { Song } from "../../../generated/model/song";

export type SongListInfo = {
  songList: Song[];
  setSongList: (arg: Song[]) => void;
};

const useSongListInfoStore = create<SongListInfo>((set) => ({
  songList: [],
  setSongList: (val: Song[]) => set((state) => ({ ...state, songList: val })),
}));

export default useSongListInfoStore;
