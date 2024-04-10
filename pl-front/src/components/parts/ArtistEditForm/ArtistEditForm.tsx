import { Button, Col, Input, Row, Typography } from "antd";
import { useEffect, useState } from "react";
import { Artist } from "../../../generated/model/artist";
import styles from "./ArtistEditForm.module.css";

export type ArtistEditFormProps = {
  isRegister?: boolean;
  artist: Artist;
  onOkCallback: (artist: Artist) => void;
};

const ArtistEditForm = (props: ArtistEditFormProps) => {
  const { isRegister, artist, onOkCallback } = props;
  const [artistName, setArtistName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    setArtistName(artist.name ?? "");
    setDescription(artist.description ?? "");
  }, [artist]);

  const onClick = () => {
    onOkCallback({
      id: artist.id,
      name: artistName,
      description: description,
    });
  };

  return (
    <>
      <Row>
        <Col span={24}>
          <Typography.Title level={5}>アーティスト名</Typography.Title>
          <Input
            value={artistName}
            onChange={(e) => setArtistName(e.target.value)}
            placeholder="アーティスト名を入力してください"
          />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Typography.Title level={5}>説明文</Typography.Title>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="アーティストの説明を入力してください"
          />
        </Col>
      </Row>
      <Row justify="end">
        <Col span={4}>
          <Button
            onClick={onClick}
            disabled={!artistName.trim() || !description}
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

export default ArtistEditForm;
