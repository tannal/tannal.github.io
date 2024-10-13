
---
title: Mnist 
date: 2024-10-10T10:51:56+08:00
categories:
    - 大语言模型
tags:
    - 神经网络
---



# 多机多卡训练 

在本教程中，我们将使用 PyTorch 和 Accelerate 库来训练一个简单的神经网络模型，该模型用于对 FashionMNIST 数据集中的服装图像进行分类。我们将使用多机多卡训练模型，以便在多个 GPU 上并行训练模型。

```bash

import os
import torch
import torch.distributed as dist
from torch import nn
from torch.utils.data import DataLoader
from torchvision import datasets
from torchvision.transforms import ToTensor
from accelerate import Accelerator

def setup(rank, world_size):
    os.environ['MASTER_ADDR'] = 'localhost'
    os.environ['MASTER_PORT'] = '12355'
    dist.init_process_group("nccl", rank=rank, world_size=world_size)

def cleanup():
    dist.destroy_process_group()

def train(rank, world_size):
    setup(rank, world_size)
    
    accelerator = Accelerator()

    # 下载训练数据
    training_data = datasets.FashionMNIST(
        root="data",
        train=True,
        download=True,
        transform=ToTensor(),
    )

    # 下载测试数据
    test_data = datasets.FashionMNIST(
        root="data",
        train=False,
        download=True,
        transform=ToTensor(),
    )

    batch_size = 32
    train_dataloader = DataLoader(training_data, batch_size=batch_size)
    test_dataloader = DataLoader(test_data, batch_size=batch_size)

    device = accelerator.device

    # 定义模型
    class NeuralNetwork(nn.Module):
        def __init__(self):
            super().__init__()
            self.flatten = nn.Flatten()
            self.linear_relu_stack = nn.Sequential(
                nn.Linear(28 * 28, 512),
                nn.ReLU(),
                nn.Linear(512, 512),
                nn.ReLU(),
                nn.Linear(512, 10),
            )

        def forward(self, x):
            x = self.flatten(x)
            logits = self.linear_relu_stack(x)
            return logits

    model = NeuralNetwork().to(device)
    loss_fn = nn.CrossEntropyLoss()
    optimizer = torch.optim.SGD(model.parameters(), lr=1e-2)

    model, train_dataloader, test_dataloader, optimizer = accelerator.prepare(
        model, train_dataloader, test_dataloader, optimizer
    )

    def train_epoch(dataloader, model, loss_fn, optimizer):
        size = len(dataloader.dataset)
        model.train()
        for batch, (X, y) in enumerate(dataloader):
            pred = model(X)
            loss = loss_fn(pred, y)
            accelerator.backward(loss)
            optimizer.step()
            optimizer.zero_grad()

            if batch % 100 == 0:
                loss, current = loss.item(), (batch + 1) * len(X)
                print(f"loss: {loss:>7f}  [{current:>5d}/{size:>5d}]")

    def test(dataloader, model, loss_fn):
        size = len(dataloader.dataset)
        num_batches = len(dataloader)
        model.eval()
        test_loss, correct = 0, 0
        with torch.no_grad():
            for X, y in dataloader:
                pred = model(X)
                test_loss += loss_fn(pred, y).item()
                correct += (pred.argmax(1) == y).type(torch.float).sum().item()
        test_loss /= num_batches
        correct /= size
        print(f"Test Error: \n Accuracy: {(100*correct):>0.1f}%, Avg loss: {test_loss:>8f} \n")

    epochs = 5
    for t in range(epochs):
        print(f"Epoch {t+1}\n-------------------------------")
        train_epoch(train_dataloader, model, loss_fn, optimizer)
        test(test_dataloader, model, loss_fn)
    print("Done!")

    cleanup()

if __name__ == "__main__":
    world_size = torch.cuda.device_count()
    torch.multiprocessing.spawn(train, args=(world_size,), nprocs=world_size, join=True)

```

在上面的代码中，我们首先导入必要的库，然后定义了一些辅助函数，如 `setup` 和 `cleanup`。接下来，我们定义了 `train` 函数，该函数用于训练模型。在 `train` 函数中，我们首先调用 `setup` 函数来初始化进程组，然后创建一个 `Accelerator` 对象，该对象用于加速训练过程。接着，我们下载了 FashionMNIST 数据集，并创建了训练和测试数据加载器。然后，我们定义了一个简单的神经网络模型，并将其移动到 GPU 上。接着，我们定义了损失函数和优化器，并调用 `accelerator.prepare` 函数来准备模型、数据加载器和优化器。最后，我们定义了 `train_epoch` 和 `test` 函数，用于训练和测试模型。最后，我们使用 `torch.multiprocessing.spawn` 函数来启动多个进程，以便在多个 GPU 上并行训练模型。

```bash

conda install pytorch torchvision torchaudio pytorch-cuda=12.1 -c pytorch -c nvidia
pip install accelerate

```