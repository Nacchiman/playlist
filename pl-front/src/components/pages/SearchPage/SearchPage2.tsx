import { UseQueryResult } from "@tanstack/react-query";
import {
  Checkbox,
  Col,
  Input,
  Radio,
  RadioChangeEvent,
  Row,
  Table,
} from "antd";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";

// クエリのレスポンスデータ型
export type DataItem = any;

// クエリ情報の型
export type QueryInfo<T = unknown> = {
  queryResult: UseQueryResult<AxiosResponse<T[], any>>;
  label: string;
  value: string;
};

export type SearchPageProps = {
  queries: QueryInfo[];
};

const SearchPage2 = (props: SearchPageProps) => {
  const { queries } = props;
  const [searchType, setSearchType] = useState(queries[0].value);
  const [dataSource, setDataSource] = useState<DataItem[]>([]);
  const [searchText, setSearchText] = useState("");
  const [filterAttributes, setFilterAttributes] = useState([
    "name",
    "description",
  ]);

  useEffect(() => {
    const selectedQuery = queries.find((q) => q.value === searchType);
    if (selectedQuery) {
      setDataSource(selectedQuery.queryResult.data?.data ?? []);
    }
  }, [searchType, queries]);

  const handleSearchTypeChange = (e: RadioChangeEvent) => {
    setSearchType(e.target.value);
  };

  const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleFilterChange = (checkedValues: CheckboxValueType[]) => {
    setFilterAttributes(checkedValues as string[]);
  };

  // OR検索を行い、選択された属性でフィルタリング
  const filterDataSource = () => {
    const keywords = searchText.trim().split(/[\s　]+/);
    if (!searchText || filterAttributes.length === 0) {
      return dataSource;
    }

    return dataSource.filter((item) => {
      return filterAttributes.some((attr) => {
        const value = item[attr];
        if (!value) return false;
        const lowerValue = value.toLowerCase();
        return keywords.some((keyword) =>
          lowerValue.includes(keyword.toLowerCase())
        );
      });
    });
  };

  const filteredDataSource = filterDataSource();

  const columns = [
    {
      title: "名前",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "説明",
      dataIndex: "description",
      key: "description",
    },
    // さらに条件に応じて列を追加する場合はここに記述
  ];
  return (
    <div>
      <Row gutter={16}>
        <Col>
          <Radio.Group onChange={handleSearchTypeChange} value={searchType}>
            {queries.map((query) => (
              <Radio key={query.value} value={query.value}>
                {query.label}
              </Radio>
            ))}
          </Radio.Group>
        </Col>
        <Col>
          <Input placeholder="検索..." onChange={handleSearchTextChange} />
        </Col>
        <Col>
          <Checkbox.Group
            options={[
              { label: "名前で検索", value: "name" },
              { label: "説明で検索", value: "description" },
              // 他の検索条件を追加する場合はここに記述
            ]}
            defaultValue={["name", "description"]}
            onChange={handleFilterChange}
          />
        </Col>
      </Row>
      <Table
        dataSource={filteredDataSource}
        columns={columns}
        rowKey="id"
        pagination={{ position: ["bottomCenter"] }}
      />
    </div>
  );
};

export default SearchPage2;
