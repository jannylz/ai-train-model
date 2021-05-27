import { useContext, useState, useEffect } from 'react';
import formParams from './config';
import DataChoose from './DataChoose';
import ParamConfig from './ParamConfig';
import './index.css';

import * as http from '../../utils/http';

const ConfigTrain = (props) => {
  const [dataConfig, setDataConfig] = useState(JSON.parse(JSON.stringify(formParams)));
  const [onManageIsVisible, setOnManageIsVisible] = useState(false);

  useEffect(() => {
    if (props.location.state) {
      dataConfig.project = props.location.state;
      setDataConfig(dataConfig)
    }
  }, [props.location.state]);

  const onCreate = (data, transforms, network, training) => {
    console.log(data, transforms, network, training)
    console.log(dataConfig)
    for (let key in data) {
      dataConfig.data[key] = data[key];
    }
    dataConfig.data.transforms = transforms;
    dataConfig.network = network;
    dataConfig.training = training;
    setDataConfig(dataConfig);
    http.post('/manage/save_config_file', { config: JSON.stringify(dataConfig) }).then(data => {
      console.log(data)
    })
  }

  const onManage = (param) => {
      for (let key in param) {
        if (formParams.data[key]) dataConfig.data[key] = param[key];
      }
      if (param.classes_list instanceof Array) {
        let custom_head = param.classes_list.map((num) => {
          let obj = {
            "head": "FullyConnectedHead",
            "num_classes": num.length,
            "num_fc": 1,
            "fc_channels": 1024,
            "with_dropout": true,
            "keep_prob": 0.5
          };
          return obj;
        });
        dataConfig.network.custom_head = custom_head;
      }
      setDataConfig(dataConfig);
  }

  const OnCheckTrain = () => {
    http.post('/manage/check_dataset_and_config', { config: JSON.stringify(dataConfig) }).then(data => {
      console.log(data)
    })
  }
  return (
    <div>
      <DataChoose onManage={onManage}  onManageIsVisible={(val)=>{setOnManageIsVisible(val)}} />
      {onManageIsVisible && <ParamConfig dataVals={dataConfig} initVals={formParams} onCreate={onCreate} OnCheckTrain={OnCheckTrain} />}
    </div>
  )
}


export default ConfigTrain;