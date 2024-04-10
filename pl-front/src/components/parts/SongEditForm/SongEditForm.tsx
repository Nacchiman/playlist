import { Button, Col, Input, Row, Select, Typography } from "antd";
import { useEffect, useState } from "react";
import { Artist } from "../../../generated/model";
import { Song } from "../../../generated/model/song";
import styles from "./SongEditForm.module.css";

export type SongEditFormProps = {
  isRegister?: boolean;
  song: Song;
  artists: Artist[];
  onOkCallback: (song: Song) => void;
};

const SongEditForm = (props: SongEditFormProps) => {
  const { isRegister, song, artists, onOkCallback } = props;
  const [songName, setSongName] = useState("");
  const [description, setDescription] = useState("");
  const [artist, setArtist] = useState<Artist>();

  useEffect(() => {
    setSongName(song.name ?? "");
    setDescription(song.description ?? "");
    setArtist(song.artist ?? undefined);
  }, [song]);

  const onClick = () => {
    onOkCallback({
      id: song.id,
      name: songName,
      artist: artist,
      description: description,
    });
  };

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  return (
    <>
      <Row>
        <Col span={24}>
          <Typography.Title level={5}>曲名</Typography.Title>
          <Input
            value={songName}
            onChange={(e) => setSongName(e.target.value)}
            placeholder="曲名を入力してください"
          />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Typography.Title level={5}>アーティスト</Typography.Title>
          <Select
            value={artist?.name}
            showSearch
            filterOption={filterOption}
            placeholder="アーティストを選択してください"
            optionFilterProp="children"
            onChange={(selectedId) => {
              const selectedArtist = artists.find(
                (artist) => artist.id === selectedId
              );
              setArtist(selectedArtist);
            }}
            // アーティストリストを参照する
            options={artists
              .filter((artist) => artist.name && artist.id)
              .map((artist) => ({
                label: artist.name ?? "",
                value: artist.id ?? "",
              }))}
            className={styles.select}
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
      <Row justify="end">
        <Col span={4}>
          <Button
            onClick={onClick}
            disabled={!songName.trim() || !description}
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

export default SongEditForm;
