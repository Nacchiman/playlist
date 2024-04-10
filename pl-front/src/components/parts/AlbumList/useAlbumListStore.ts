import { create } from "zustand";
import { Album } from "../../../generated/model/album";

export type AlbumListInfo = {
  albumList: Album[];
  setAlbumList: (arg: Album[]) => void;
};

const useAlbumListInfoStore = create<AlbumListInfo>((set) => ({
  albumList: [],
  setAlbumList: (val: Album[]) =>
    set((state) => ({ ...state, albumList: val })),
}));

export default useAlbumListInfoStore;
