import { Button, Col, Input, Row, Typography } from "antd";
import { useEffect, useState } from "react";
import { Album } from "../../../generated/model/album";
import { Song } from "../../../generated/model/song";
import AlbumSongList from "../AlbumSongList/AlbumSongList";
import styles from "./AlbumEditForm.module.css";

export type AlbumEditFormProps = {
  isRegister?: boolean;
  album: Album;
  songs: Song[];
  onOkCallback: (album: Album) => void;
};

const AlbumEditForm = (props: AlbumEditFormProps) => {
  const { isRegister, album, songs, onOkCallback } = props;
  const [albumName, setAlbumName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSongs, setSelectedSongs] = useState<Song[]>();

  useEffect(() => {
    setAlbumName(album.name ?? "");
    setDescription(album.description ?? "");
    setSelectedSongs(album.songs ?? []);
  }, [album]);

  const onClick = () => {
    onOkCallback({
      id: album.id,
      name: albumName,
      description: description,
      songs: selectedSongs,
    });
  };

  return (
    <>
      <Row>
        <Col span={24}>
          <Typography.Title level={5}>アルバム名</Typography.Title>
          <Input
            value={albumName}
            onChange={(e) => setAlbumName(e.target.value)}
            placeholder="アルバム名を入力してください"
          />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Typography.Title level={5}>説明文</Typography.Title>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="曲の説明を入力してください"
          />
        </Col>
      </Row>
      <Row align={"middle"}>
        <Col span={24}>
          <Typography.Title level={5}>収録曲</Typography.Title>
          <AlbumSongList
            songList={songs}
            selectedSongs={selectedSongs ?? []}
            setSelectedSongs={setSelectedSongs}
          />
        </Col>
      </Row>
      <Row justify="end">
        <Col span={4}>
          <Button
            onClick={onClick}
            disabled={
              !albumName.trim() || selectedSongs?.length === 0 || !description
            }
            type="primary"
            block
            className={styles.confirmButton}
          >
            {isRegister ? "登録" : "更新"}
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default AlbumEditForm;
