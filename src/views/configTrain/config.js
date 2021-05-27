const formParams ={
  "project": {
      "project_id": "4b194838-b9dd-11eb-bf6c-5d47677f2511",
      "project_path": "/media/ai/041AF2C11AF2AF34/haoqiang/MiniCls/test/4b194838-b9dd-11eb-bf6c-5d47677f2511",
      "version_id": "4b194838-b9dd-11eb-bf6c-5d47677f2512",
      "version_path": "/media/ai/041AF2C11AF2AF34/haoqiang/MiniCls/test/4b194838-b9dd-11eb-bf6c-5d47677f2511/4b194838-b9dd-11eb-bf6c-5d47677f2512"
  },
  "data": {
      "task_type": "multi_task",
      "attributes_list": [
          "sex",
          "age"
      ],
      "classes_list": [
          [
              "male",
              "female"
          ],
          [
              "20",
              "30",
              "40"
          ]
      ],
      "num_classes_list": [
          2,
          3
      ],
      "train_data_path": "test_data/images",
      "train_lable_path": "test_data/train_label.txt",
      "valid_data_path": "test_data/images",
      "valid_lable_path": "test_data/valid_label.txt",
      "classes_info_path": "test_data/classes_info.txt",
      "input_height": 224,
      "input_width": 224,
      "batch_size": 2,
      "bgr2rgb": true,
      "transforms": {
          "RandomAffine": {
              "degrees": 30,
              "translate": [
                  0.1,
                  0.1
              ],
              "scale": [
                  0.8,
                  1.2
              ],
              "shear": 0.1 //null
          },
          "Resize": {
              "size": [
                  224,
                  224
              ],
              "interpolation": "BILINEAR"
          },
          "RandomHorizontalFlip": {
              "p": 0.5
          },
          "RandomVerticalFlip": {
              "p":0.5,
          },
          "ColorJitter": {
              "brightness": 0.3,
              "contrast": 0,
              "saturation": 0,
              "hue": 0
          },
          "RandomGrayscale": {
              "p": 0.2//null
          },
          "Normalize": {
              "mean": [
                  0.485,
                  0.456,
                  0.406
              ],
              "std": [
                  0.229,
                  0.224,
                  0.225
              ]
          }
      }
  },
  "network": {
      "model": {
          "model": "mobilenet_v2",
      },
      "custom_head": [
          {
              "head": "FullyConnectedHead",
              "num_classes": 1,
              "num_fc": 1,
              "fc_channels": 1024,
              "with_dropout": true,
              "keep_prob": 0.5
          },
          {
              "head": "FullyConnectedHead",
              "num_classes": 3,
              "num_fc": 1,
              "fc_channels": 1024,
              "with_dropout": true,
              "keep_prob": 0.5
          }
      ],
      "output_act": "Softmax"
  },
  "training": {
      "resume": true,//固定值
 
      "learning_rate": 0.001,
      "warmup": {
          "epochs": 3,
          "method": "linear",//constant /linear
          "factor": 0.2
      },
      "epochs": 50,
      "lr_decay_milestones": [
          5,
          10
      ],
      "lr_decay_ratio": 0.1,
      "optimizer": "Adam",//唯一
      "weight_decay": 0,//0-1
      "gpu_ids": [
          0
      ]
      //损失函数，交叉熵
  }
}

export default formParams;
