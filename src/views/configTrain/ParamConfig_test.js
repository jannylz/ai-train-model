import React, { useState } from 'react';
import { Collapse } from 'antd';

import { Form, Input, Tooltip, InputNumber, Button, Radio, Select, Switch, Checkbox, Row, Col, Space } from 'antd';
const { Panel } = Collapse;

const layout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 18,
  },
};

const modelOptions = ["alexnet", "densenet121", "densenet169", "densenet201", "densenet161", "googlenet", "inception_v3", "mnasnet0_5", "mnasnet1_0", "mobilenet_v2", "mobilenet_v3_small", "mobilenet_v3_large", "resnet18", "resnet34", "resnet50", "resnet101", "resnet152", "resnext50_32x4d", "resnext101_32x8d", "wide_resnet50_2", "wide_resnet101_2", "shufflenetv2_x0.5", "shufflenetv2_x1.0", "squeezenet1_0", "squeezenet1_1", "vgg11", "vgg11_bn", "vgg13", "vgg13_bn", "vgg16", "vgg16_bn", "vgg19_bn", "vgg19"].map((item, index) => {
  return <Select.Option key={index.toString()}>{item} </Select.Option >;
})

const ParamConfig = (props) => {
  const { dataVals, onCreate } = props;
  const [form] = Form.useForm();
  const [fullyConnectedHead, setFullyConnectedHead] = useState(false);
  const [degreesBox, setDegreesBox] = useState(true);
  const [translateBox, setTranslateBox] = useState(true);
  const [scaleBox, setScaleBox] = useState(true);
  const [shearBox, setShearBox] = useState(false);
  const [randomHorizontalFlip, setRandomHorizontalFlip] = useState(true);
  const [randomVerticalFlip, setRandomVerticalFlip] = useState(false);
  const [brightness, setBrightness] = useState(true);
  const [contrast, setContrast] = useState(false);
  const [saturation, setSaturation] = useState(false);
  const [hueBox, setHueBox] = useState(false);
  const [randomGrayscale, setRandomGrayscale] = useState(false);
  const [warmup, setWarmup] = useState(true);

  const changeFullyConnected = (status) => {
    setFullyConnectedHead(status)
  }

  const handSubmit = async () => {
    try {
      const values = await form.validateFields();
      onCreate(values);
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }

  return (
    <Collapse defaultActiveKey={['1']} >
      <Panel header="参数配置" key="1">
        <Form {...layout} form={form} name="nest-messages" size={"small"} initialValues={dataVals} >
          <Form.Item label="图像输入的尺寸" style={{ marginBottom: 0 }}>
            <Form.Item name={['data', 'input_height']} style={{ display: 'inline-block' }}>高: <InputNumber min={1} defaultValue={224} /></Form.Item>
            <Form.Item name={['data', 'input_width']} style={{ display: 'inline-block' }}>宽: <InputNumber min={1} defaultValue={224} /></Form.Item>
          </Form.Item>
          <Form.Item name={['data', 'batch_size']} label="批大小(Batch Size)">
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item name={['data', 'bgr2rgb']} label="输入图像通道顺序">
            <Radio.Group >
              <Radio value={true}>RGB</Radio>
            </Radio.Group>
          </Form.Item>
            数据增强
          <Row justify="left">
            <Col span={4} style={{ textAlign: "right" }}>
              <Checkbox value={['data', 'transforms', 'RandomAffine', 'degrees']} defaultChecked={degreesBox} onChange={(e) => { setDegreesBox(e.target.checked) }}>
                随机旋转
              </Checkbox>
            </Col>
            <Col span={4}>
              <Form.Item name={['data', 'transforms', 'RandomAffine', 'degrees']} label="旋转角" style={{ visibility: (degreesBox ? 'visible' : 'hidden') }}>
                <InputNumber min={1} />
              </Form.Item>
            </Col>
            <Col span={4} style={{ textAlign: "right" }}>
              <Checkbox value="translate" defaultChecked={translateBox} onChange={(e) => { setTranslateBox(e.target.checked) }}>
                随机平移:
              </Checkbox>
            </Col>
            <Col style={{ visibility: (translateBox ? 'visible' : 'hidden') }}>
              <span>水平平移比例:</span>
              <Form.Item name={['data', 'transforms', 'RandomAffine', 'translate', 0]} style={{ display: 'inline-block' }}>
                <InputNumber min={0} max={1} step={0.1} />
              </Form.Item>
              <span>竖直平移比例:</span>
              <Form.Item name={['data', 'transforms', 'RandomAffine', 'translate', 1]} style={{ display: 'inline-block' }}>
                <InputNumber min={0} max={1} step={0.1} />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="left">
            <Col span={4} style={{ textAlign: "right" }}>
              <Checkbox value="shear" defaultChecked={shearBox} onChange={(e) => { setShearBox(e.target.checked) }}>
                随机错切:
              </Checkbox>
            </Col>
            <Col span={4} style={{ visibility: (shearBox ? 'visible' : 'hidden') }} >
              <Row wrap={false}>
                <Form.Item name={['data', 'transforms', 'RandomAffine', 'shear']} label="概率:">
                  <InputNumber min={0} step={0.1} />
                </Form.Item>
              </Row>
            </Col>
            <Col span={4} style={{ textAlign: "right" }}>
              <Checkbox value="scale" defaultChecked={scaleBox} onChange={(e) => { setScaleBox(e.target.checked) }} >
                随机缩放:
               </Checkbox>
            </Col>
            <Col style={{ visibility: (scaleBox ? 'visible' : 'hidden') }}>
              <Form.Item name={['data', 'transforms', 'RandomAffine', 'scale', 0,]} style={{ display: 'inline-block' }}>
                <InputNumber min={0} max={1} step={0.1} /></Form.Item>
              <span>~</span>
              <Form.Item name={['data', 'transforms', 'RandomAffine', 'scale', 1,]} style={{ display: 'inline-block' }}>
                <InputNumber min={0} step={0.1} /></Form.Item>
            </Col>

          </Row>
          <Row justify="left">
            <Col span={4} style={{ textAlign: "right" }}>
              <Checkbox value="RandomHorizontalFlip" defaultChecked={randomHorizontalFlip} onChange={(e) => { setRandomHorizontalFlip(e.target.checked) }}>
                随机水平翻转:
              </Checkbox>
            </Col>
            <Col span={4} style={{ visibility: (randomHorizontalFlip ? 'visible' : 'hidden') }} >
              <Form.Item name={['data', 'transforms', 'RandomHorizontalFlip', 'p']} label="概率:">
                <InputNumber min={0} step={0.1} />
              </Form.Item>
            </Col>
            <Col span={4} style={{ textAlign: "right" }}>
              <Checkbox value="RandomVerticalFlip"
                defaultChecked={randomVerticalFlip}
                onChange={(e) => { setRandomVerticalFlip(e.target.checked) }}>
                随机竖直翻转:
              </Checkbox>
            </Col>
            <Col style={{ visibility: (randomVerticalFlip ? 'visible' : 'hidden') }} >
              <Form.Item name={['data', 'transforms', 'RandomVerticalFlip', 'p']} label="概率:">
                <InputNumber min={0} step={0.1} />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="left" wrap={false}>
            <Col span={4} style={{ textAlign: "right" }}>
              <Checkbox value="brightness"
                defaultChecked={brightness}
                onChange={(e) => { setBrightness(e.target.checked) }}
              >
                随机亮度变化:
              </Checkbox>
            </Col>
            <Col span={4} style={{ visibility: (brightness ? 'visible' : 'hidden') }}>
              <Row wrap={false}>
                <Form.Item name={['data', 'transforms', 'ColorJitter', 'brightness']} label="比例">
                  <InputNumber min={0} step={0.1} />
                </Form.Item>
              </Row>
            </Col>
            <Col span={4} style={{ textAlign: "right" }}>
              <Checkbox value="contrast"
                defaultChecked={contrast}
                onChange={(e) => { setContrast(e.target.checked) }}>
                随机对比度:
              </Checkbox>
            </Col>
            <Col span={4} style={{ visibility: (contrast ? 'visible' : 'hidden') }} >
              <Row wrap={false}>
                <Form.Item name={['data', 'transforms', 'ColorJitter', 'contrast']} label="概率">
                  <InputNumber min={0} step={0.1} />
                </Form.Item>
              </Row>
            </Col>
          </Row>

          <Row justify="left">
            <Col span={4} style={{ textAlign: "right" }}>
              <Checkbox value={['data', 'transforms', 'ColorJitter', 'saturation']}
                defaultChecked={saturation}
                onChange={(e) => { setSaturation(e.target.checked) }}
              >
                随机饱和度:
                </Checkbox>
            </Col>
            <Col style={{ visibility: (saturation ? 'visible' : 'hidden') }} >
              <Form.Item name={['data', 'transforms', 'ColorJitter', 'saturation']} label="概率:">
                <InputNumber min={0} step={0.1} />
              </Form.Item>
            </Col>
            <Col span={4} style={{ textAlign: "right" }}>
              <Checkbox value="hue"
                defaultChecked={hueBox}
                onChange={(e) => { setHueBox(e.target.checked) }}
              >
                随机色调:
              </Checkbox>
            </Col>
            <Col style={{ visibility: (hueBox ? 'visible' : 'hidden') }} >
              <Form.Item name={['data', 'transforms', 'ColorJitter', 'hue']} label="概率:">
                <InputNumber min={0} />
              </Form.Item>
            </Col>
            <Col span={4} style={{ textAlign: "right" }}>
              <Checkbox value={['data', 'transforms', 'RandomGrayscale']}
                defaultChecked={randomGrayscale}
                onChange={(e) => {
                  console.log(form.getFieldsValue(true))
                  setRandomGrayscale(e.target.checked) 
                  console.log('e.target.value',e.target.value)
                }}
              >
                随机灰度化:
              </Checkbox>
            </Col>
            <Col style={{ visibility: (randomGrayscale ? 'visible' : 'hidden') }} >
              <Form.Item name={['data', 'transforms', 'RandomGrayscale', "p"]} label="概率:">
                <InputNumber min={0} step={0.1} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="归一化" style={{ marginBottom: 0 }}>
            <span>均值:</span>
            <Form.Item name={['data', 'transforms', 'Normalize', 'mean', 0]} style={{ display: 'inline-block', marginBottom: 0 }}>
              <InputNumber min={0} max={1} step={0.1} />
            </Form.Item>
            <Form.Item name={['data', 'transforms', 'Normalize', 'mean', 1]} style={{ display: 'inline-block', marginBottom: 0 }}>
              <InputNumber min={0} max={1} step={0.1} />
            </Form.Item>
            <Form.Item name={['data', 'transforms', 'Normalize', 'mean', 2]} style={{ display: 'inline-block', marginBottom: 0 }}>
              <InputNumber min={0} max={1} step={0.1} />
            </Form.Item>
            <br />
              方差:
              <Form.Item name={['data', 'transforms', 'Normalize', 'std', 0]} style={{ display: 'inline-block', marginBottom: 0 }}>
              <InputNumber min={0} max={1} step={0.1} />
            </Form.Item>
            <Form.Item name={['data', 'transforms', 'Normalize', 'std', 1]} style={{ display: 'inline-block', marginBottom: 0 }}>
              <InputNumber min={0} max={1} step={0.1} />
            </Form.Item>
            <Form.Item name={['data', 'transforms', 'Normalize', 'std', 2]} style={{ display: 'inline-block', marginBottom: 0 }}>
              <InputNumber min={0} max={1} step={0.1} />
            </Form.Item>
          </Form.Item>
            网络结构:
            <Form.Item name={['network', 'model', 'model']} label="模型选择" >
            <Select style={{ width: 200 }}>
              {modelOptions}
            </Select>
          </Form.Item>
          <Form.Item label="自定义顶层MLP" valuePropName="checked" >
            <Switch checkedChildren="开启" unCheckedChildren="关闭" onChange={changeFullyConnected} />
          </Form.Item>
          <div style={{ display: fullyConnectedHead ? "block" : "none" }}>
            <Form.List name={['network', 'custom_head']}>
              {(fields) => (
                <>
                  {fields.map(({key, name}) => {
                    return (
                      <Space key={key} style={{ marginBottom: 0 }} align="baseline">
                        <Form.Item labelCol={'span:8'} name={[name, 'num_fc']} fieldKey={[name, 'num_fc']} label="全连接层数(不包括输出层)">
                          <InputNumber min={1} />
                        </Form.Item>
                        <Form.Item labelCol={'span:8'} name={[name, 'fc_channels']}fieldKey={[name, 'fc_channels']} label="全连接层神经元数">
                          <InputNumber min={1} />
                        </Form.Item>
                        <Form.Item labelCol={'span:8'} name={[name, 'with_dropout']} fieldKey={[name, 'with_dropout']} label="是否使用dropout">
                          <Radio.Group>
                            <Radio value={true}>是</Radio>
                            <Radio value={false}>否</Radio>
                          </Radio.Group>
                        </Form.Item>
                        <Form.Item labelCol={'span:8'} name={[name, 'keep_prob']}  fieldKey={[name, 'keep_prob']} label="Dropout keep prob">
                          <InputNumber min={1} />
                        </Form.Item>
                      </Space>
                    )
                  }
                  )}
                </>
              )}
            </Form.List>
          </div>
          <Form.Item name={['network', 'output_act']} label="激活函数">
            <Radio.Group >
              <Radio value={"Softmax"}>Softmax</Radio>
            </Radio.Group>
          </Form.Item>
            训练参数：
            <Form.Item name={['training', 'learning_rate']} label="初始学习率">
            <InputNumber min={0} step={0.001} />
          </Form.Item>
          <Row justify="left">
            <Col span={4} style={{ textAlign: "right" }}>
              <Checkbox value={['training', 'warmup']}
                defaultChecked={warmup}
                onChange={(e) => { setWarmup(e.target.checked) }}
              >
                warmup:
                </Checkbox>
            </Col>
            <Space style={{ visibility: (warmup ? 'visible' : 'hidden') }} >
              <Form.Item labelCol={'span:8'} name={['training', 'warmup', 'epochs']} label="warm up轮数">
                <InputNumber min={1} />
              </Form.Item>
              <Form.Item labelCol={'span:8'} name={['training', 'warmup', 'method']} label="是否使用dropout">
                <Radio.Group>
                  <Radio value={'linear'}>linear</Radio>
                  <Radio value={'constant'}>constant</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item labelCol={'span:8'} name={['training', 'warmup', 'factor']} label="比列因子">
                <InputNumber min={1} />
              </Form.Item>
            </Space>
          </Row>
          <Form.Item name={['training', 'epochs']} label="训练轮次epoch">
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item style={{display:'flex'}}>
            <Form.Item name={['training', 'lr_decay_milestones']} label="在哪些epoch之后降低学习率">
              <Input style={{ width: 200 }} />
            </Form.Item>
            <span>(格式:3,6,9)</span>
          </Form.Item>

          <Form.Item name={['training', 'lr_decay_ratio']} label="学习率下降系数">
            <InputNumber min={0} step={0.001} />
          </Form.Item>
          <Form.Item name={['training', 'optimizer']} label="优化器">
            <Input style={{ width: 200 }} />
          </Form.Item>
          <Form.Item name={['training', 'weight_decay']} label="权重衰减">
            <InputNumber min={0} step={0.1} />
          </Form.Item>
          <Form.Item name={['training', 'gpu_ids']} label="gpu序号">
            <Input style={{ width: 200 }} />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" onClick={handSubmit} style={{ marginRight: 12 }}>
              启动训练
            </Button>
            <Button type="primary" htmlType="submit" onClick={handSubmit}>
              保存
            </Button>
          </Form.Item>
        </Form>
      </Panel>
    </Collapse >
  );
}

export default ParamConfig;
