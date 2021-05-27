import React, { useState, useEffect } from 'react';
import { Collapse, Form, Input, TreeSelect, Button, Modal, Table, Descriptions, Tabs } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import * as echarts from 'echarts';
import * as http from '../../utils/http';
const { Panel } = Collapse;
const { TabPane } = Tabs;

const EchartsNode = ({ charDataList }) => {
  useEffect(() => {
      charDataList.attributes_list.map(async (list, index) => {
        updateOptionData(charDataList, list + index, list, index, 'num_train_data_each_class', '#2378f7');
        updateOptionData(charDataList, list + index + 1, list, index, 'num_valid_data_each_class', '#91cc75');
      });
  }, [JSON.stringify(charDataList)]);
  
  const largestOfFour = (arr) => {
    let concatData = [];
    arr.map(item => {
      concatData = concatData.concat(item);
      return concatData;
    })
    concatData.sort((num1, num2) => {
      return num1 - num2 < 0
    });

    return concatData[0];
  }

  const updateOptionData = (dataList, id, title, index, type, color = '') => {
    let chartDom1 = document.getElementById(id);
    var myChart = echarts.init(chartDom1, null, { width: 200, height: 200 });
    let option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: {
        data: [title]
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '5%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: dataList.classes_list[index]
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        max: largestOfFour(dataList[type])
      },
      series: [{
        name: title,
        data: dataList[type][index],
        type: 'bar',
        barWidth: 20,
        itemStyle: {
          color: color
        },
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)'
        }
      }]
    };
    myChart.setOption(option);
  }

  return (charDataList.attributes_list.map((list, index) => (<div key={list}>
    训练集：
    <div id={list + index} key={list + index} style={{ width: 200, height: 200 }}></div>
      验证集:
    <div id={list + index + 1} key={list + index + 1} style={{ width: 200, height: 200 }}></div>
  </div>
  )))
}

const root_data_path = "D:\\work\\08_2021\\AI_Demos\\MiniCls\\test_data"
const initVals = {//for Test
  "data": {
    'train_data_path': root_data_path + '/images',
    'train_lable_path': root_data_path + '/train_label.txt',
    'valid_data_path': root_data_path + '/images',
    'valid_lable_path': root_data_path + '/valid_label.txt',
    'classes_info_path': root_data_path + '/classes_info.txt'
  }
}


const datasetType = {
  "attributes_list": "属性",
  "classes_list": "类别",
  "num_train_data_each_class": "训练集数据量",
  'num_valid_data_each_class': "验证集数据量"
};

const datasetInfo = {
  "num_train_label": {
    "title": "训练集数据量",
    "children": {
      "num_train_label": "总数",
      "num_train_label_right": "标注正确",
      "num_train_label_error": "标注错误",
      "num_train_image_part_label": "部分标注",
    }
  },
  "num_valid_label": {
    "title": "验证集数据量",
    "children": {
      'num_valid_label': "总数",
      'num_valid_label_right': "标注正确",
      'num_valid_label_error': "标注错误",
      'num_valid_image_part_label': "部分标注",
    }
  }
}

const dataKeyInfo = ['task_type', "num_train_label", "num_train_label_right", "num_train_label_error",
  "num_train_image_part_label", 'num_valid_label', 'num_valid_label_right', 'num_valid_label_error', 'num_valid_image_part_label']

const dataSetColumns = Object.keys(datasetInfo).map(key => {
  if (typeof (datasetInfo[key]) === 'string') {
    return {
      title: datasetInfo[key],
      dataIndex: key,
    }
  } else {
    return {
      title: datasetInfo[key].title,
      children: Object.keys(datasetInfo[key].children).map(item => ({ dataIndex: item, title: datasetInfo[key].children[item] }))
    }
  }
})

const validateMessages = {
  required: '${label} is required!',
  types: {
    number: '${label} is not a valid number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
};

const DataChoose = (props) => {
  const {onManage,onManageIsVisible} = props;
  const [form] = Form.useForm();
  const [rootDataPath] = useState(root_data_path);
  const [value, setValue] = useState(undefined);
  const [folder, setFolder] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dataSetData, setDataSetData] = useState([]);
  const [dataAttrData, setDataAttrData] = useState([]);
  const [dataAttrColumns, setDataAttrColumns] = useState([]);
  const [correctVisible, setCorrectVisible] = useState(false);
  const [errorInfo, setErrorInfo] = useState("");
  const [charDataList, setCharDataList] = useState({ attributes_list: [] });
  const [activeKey ,setaActiveKey] =useState(['1'])
  //taskType
  const [taskType, setTaskType] = useState("");
  useEffect(() => {
    const fetchFolderData = async () => {
      let data = { "file_path": rootDataPath };
      const result = await http.post('/train/get_file_list', data);
      setFolder(result.folders.map((item) => genTreeNode(rootDataPath, item)));
    }
    fetchFolderData();
    const fetchFileListData = async () => {
      let data = { "file_path": rootDataPath, "file_suffix": "txt" };
      const result = await http.post('/train/get_file_list', data);
      setFileList(
        result.folders.map(item => genTreeNode(rootDataPath, item)
        ).concat(
          result.files.map(item => genTreeNode(rootDataPath, item, true))
        ));
    }
    fetchFileListData();
  }, [rootDataPath]);

  const onFileChange = (value) => {
    setCorrectVisible(false);
    setErrorInfo("");
    setValue(value);
  };

  const onLoadFolder = (treeNode) =>
    new Promise(resolve => {
      const { id } = treeNode;
      if (folder.filter((item) => item.pId === id).length > 0) return resolve();
      setTimeout(async () => {
        const result = await http.post('/train/get_file_list', { "file_path": id });
        setFolder(folder.concat(
          result.folders.map(item => genTreeNode(id, item))
        ));
        resolve();
      }, 300);
    });

  const onLoadFiles = (treeNode) =>
    new Promise(resolve => {
      const { id } = treeNode;
      let data = { "file_path": id, "file_suffix": 'txt' };
      if (fileList.filter((item) => item.pId === id).length > 0) return resolve();
      setTimeout(async () => {
        const result = await http.post('/train/get_file_list', data);
        setFileList(
          fileList.concat(...result.folders.map(item => genTreeNode(id, item)),
            ...result.files.map(item => genTreeNode(id, item, true))
          ));
        resolve();
      }, 300);
    });


  const genTreeNode = (parentId, value, isLeaf = false) => {
    return {
      id: parentId + "/" + value,
      pId: parentId,
      value: parentId + "/" + value,
      title: value,
      isLeaf: isLeaf ? true : false,
    };
  };

  const handCheck = async () => {
    try {
      const { data: params } = await form.validateFields();
      const result = await http.post('/manage/check_dataset', params);
      setCorrectVisible(true);
      let dataList = JSON.parse(JSON.stringify(result));
      onManage(Object.assign(dataList, params));
      setTaskType(dataList.task_type);
      setCharDataList(JSON.parse(JSON.stringify(result)));

      setDataSetData(dataKeyInfo.reduce((obj, item) => {
        obj[0][item] = dataList[item];
        return obj;
      }, [{ key: 1 }]));

      const dataAttrColumns = Object.keys(datasetType).map(key => {
        return {
          title: datasetType[key],
          dataIndex: key,
          render: (value, row, index) => {
            const obj = {
              children: value,
              props: {},
            };
            if (key === 'attributes_list') {
              obj.props.rowSpan = 0;
              dataList.classes_list.reduce((num, item) => {
                if (index === num) {
                  obj.props.rowSpan = item.length;
                }
                return num + item.length;
              }, 0)
            }
            return obj;
          }
        }
      });

      setDataAttrColumns(dataAttrColumns);

      setDataAttrData(dataList.classes_list.reduce((arr, item, index) => {
        const oneObj = item.map((val, id) => {
          let obj = {}
          obj.key = val;
          for (let key in datasetType) {
            obj[key] = typeof (dataList[key][index]) === 'string' ? dataList[key][index] : dataList[key][index][id]
          }
          return obj;
        });
        return arr.concat(oneObj);
      }, []));
      setIsModalVisible(true);
    } catch (errorInfo) {
      setCorrectVisible(false);
      setErrorInfo(errorInfo);
      onManageIsVisible(false);
      console.log('Failed:', errorInfo);
    }
  }

  const handleNextClick = () => {
    onManageIsVisible(true);
    setaActiveKey([])
  };
 
  const handleModal =()=>{
    setIsModalVisible(!isModalVisible);
  }

  return (
    <Collapse Collapse={false} defaultActiveKey={['1']} activeKey={activeKey}  onChange={(e)=>{setaActiveKey(e)}}>
      <Panel header="数据选择" key="1">
        <Form initialValues={initVals} form={form} validateMessages={validateMessages}>
          <Form.Item label="根目录">
            <Input defaultValue={rootDataPath} disabled />
          </Form.Item>
          <Form.Item name={['data', 'train_data_path']} label="训练图片路径" rules={[{ required: true}]}>
            <TreeSelect
              treeDataSimpleMode
              style={{ width: '100%' }}
              value={value}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="Please select"
              treeData={folder}
              loadData={onLoadFolder}
              onChange={onFileChange}
            />
          </Form.Item>
          <Form.Item name={['data', 'train_lable_path']} label="训练集标注文件" rules={[{ required: true, }]}
            tooltip={{ title: '文件.txt结尾', icon: <InfoCircleOutlined /> }}
          >
            <TreeSelect
              treeDataSimpleMode
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="Please select"
              treeData={fileList}
              loadData={onLoadFiles}
              onChange={onFileChange}
            />

          </Form.Item>
          <Form.Item name={['data', 'valid_data_path']} label="验证集图片路径" rules={[{ required: true, }]}>
            <TreeSelect
              treeDataSimpleMode
              style={{ width: '100%' }}
              value={value}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="Please select"
              treeData={folder}
              loadData={onLoadFolder}
              onChange={onFileChange}
            />
          </Form.Item>
          <Form.Item name={['data', 'valid_lable_path']} label="验证集标注文件" rules={[{ required: true, }]}
            tooltip={{ title: '文件.txt结尾', icon: <InfoCircleOutlined /> }}
          >
            <TreeSelect
              treeDataSimpleMode
              style={{ width: '100%' }}
              value={value}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="Please select"
              treeData={fileList}
              loadData={onLoadFiles}
              onChange={onFileChange}
            />
          </Form.Item>
          <Form.Item name={['data', 'classes_info_path']} label="类别信息文件" rules={[{ required: true, }]}
            tooltip={{ title: '文件.txt结尾', icon: <InfoCircleOutlined /> }}
          >
            <TreeSelect
              treeDataSimpleMode
              style={{ width: '100%' }}
              value={value}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="Please select"
              treeData={fileList}
              loadData={onLoadFiles}
              onChange={onFileChange}
            />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" onClick={handCheck} style={{ marginRight: 8 }}>
              数据集查看
            </Button>
            {correctVisible ? <Button type="primary" htmlType="button" onClick={handleNextClick}  >
              下一步
            </Button> : <div className="ant-form-item-explain ant-form-item-explain-error">{errorInfo}</div>}

          </Form.Item>
        </Form>
        <Modal title="基本信息" visible={isModalVisible} onCancel={handleModal} width={750} footer={null}>
          <Descriptions bordered style={{ marginBottom: 20 }} >
            <Descriptions.Item label="任务类型">{taskType}</Descriptions.Item>
          </Descriptions>
          <Table bordered columns={dataSetColumns} dataSource={dataSetData} pagination={false} style={{ marginBottom: 20 }} />
          <Tabs defaultActiveKey="1" size="small" type="card">
            <TabPane tab="列表" key="table" >
              <Table bordered columns={dataAttrColumns} dataSource={dataAttrData} pagination={false} scroll={{ y: 300 }} />
            </TabPane>
            <TabPane tab="图表" key="chart" style={{ display: 'flex' }}>
              <EchartsNode charDataList={charDataList} />
            </TabPane>
          </Tabs>
        </Modal>
      </Panel>
    </Collapse >

  );
}

export default DataChoose;