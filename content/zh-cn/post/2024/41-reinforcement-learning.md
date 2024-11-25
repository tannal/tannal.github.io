---
title: Reinforcement Learning
date: 2024-10-12T10:51:56+08:00
categories:
    - 桌面系统
tags:
    - 操作系统
---


## CartPole

```py
import gym
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from time import sleep

# DQN网络
class DQN(nn.Module):
    def __init__(self, input_size, output_size):
        super(DQN, self).__init__()
        self.network = nn.Sequential(
            nn.Linear(input_size, 64),
            nn.ReLU(),
            nn.Linear(64, 32),
            nn.ReLU(),
            nn.Linear(32, output_size)
        )

    def forward(self, x):
        return self.network(x)

def train_and_display():
    # 创建环境
    env = gym.make('CartPole-v1', render_mode='human')  # 使用human模式来显示
    
    # 初始化DQN
    model = DQN(env.observation_space.shape[0], env.action_space.n)
    optimizer = optim.Adam(model.parameters())
    criterion = nn.MSELoss()

    # 训练参数
    episodes = 100
    epsilon = 1.0
    epsilon_decay = 0.995
    epsilon_min = 0.01
    gamma = 0.99

    for episode in range(episodes):
        state = env.reset()[0]  # 注意这里需要[0]
        total_reward = 0
        done = False
        truncated = False

        while not (done or truncated):
            # 渲染环境
            env.render()
            
            # epsilon-greedy策略
            if np.random.random() < epsilon:
                action = env.action_space.sample()
            else:
                with torch.no_grad():
                    q_values = model(torch.FloatTensor(state))
                    action = q_values.argmax().item()

            # 执行动作
            next_state, reward, done, truncated, _ = env.step(action)
            total_reward += reward

            # 计算目标Q值
            with torch.no_grad():
                next_q_values = model(torch.FloatTensor(next_state))
                target = reward + gamma * next_q_values.max() * (1 - done)

            # 更新网络
            current_q = model(torch.FloatTensor(state))[action]
            loss = criterion(current_q, torch.FloatTensor([target]))
            
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

            state = next_state
            
            # 控制显示速度
            sleep(0.01)

        # 衰减探索率
        epsilon = max(epsilon_min, epsilon * epsilon_decay)
        
        print(f"Episode {episode}, Total Reward: {total_reward}")

    env.close()

    # 展示训练好的模型
    print("\nDisplaying trained model...")
    env = gym.make('CartPole-v1', render_mode='human')
    for _ in range(5):  # 展示5个episode
        state = env.reset()[0]
        done = False
        truncated = False
        while not (done or truncated):
            env.render()
            with torch.no_grad():
                action = model(torch.FloatTensor(state)).argmax().item()
            state, _, done, truncated, _ = env.step(action)
            sleep(0.02)  # 放慢显示速度
    env.close()

if __name__ == "__main__":
    train_and_display()
```

这是一个使用DQN(Deep Q-Network)算法来解决CartPole问题的代码。让我分解讲解:

1. DQN网络结构:
```python
class DQN(nn.Module):
    def __init__(self, input_size, output_size):
        super(DQN, self).__init__()
        self.network = nn.Sequential(
            nn.Linear(input_size, 64),   # 输入层->64个神经元
            nn.ReLU(),                   # 激活函数
            nn.Linear(64, 32),           # 64->32个神经元
            nn.ReLU(),                   # 激活函数
            nn.Linear(32, output_size)   # 32->输出动作数
        )
```

2. 训练主循环:
```python
def train_and_display():
    # 关键参数
    epsilon = 1.0          # 探索率初始值
    epsilon_decay = 0.995  # 探索率衰减
    epsilon_min = 0.01     # 最小探索率
    gamma = 0.99          # 折扣因子
    
    for episode in range(episodes):
        state = env.reset()[0]
        while not done:
            # epsilon-greedy策略选择动作
            if random.random() < epsilon:
                action = env.action_space.sample()  # 探索
            else:
                action = model预测的最优动作        # 利用
                
            # 执行动作获得反馈
            next_state, reward, done, truncated, _ = env.step(action)
            
            # 计算目标Q值
            target = reward + gamma * max未来Q值
            
            # 更新网络
            loss = (当前Q值 - target)²
            optimizer.step()
```

3. 关键概念:

Q值学习:
```python
# Q值更新公式
target = reward + gamma * max(Q(next_state))

# 在代码中的实现
with torch.no_grad():
    next_q_values = model(torch.FloatTensor(next_state))
    target = reward + gamma * next_q_values.max() * (1 - done)
```

探索与利用:
```python
# epsilon-greedy策略
if np.random.random() < epsilon:
    action = env.action_space.sample()  # 探索
else:
    action = q_values.argmax().item()   # 利用
```

4. CartPole任务说明:
- 目标: 平衡一个杆子在小车上
- 状态空间: 4维(位置,速度,角度,角速度)
- 动作空间: 2个动作(左移或右移)
- 奖励: 每个时间步+1
- 终止条件: 杆子倾角过大或小车移出范围

5. 训练过程:
```python
# 每个episode的流程
1. 重置环境获得初始状态
2. 循环直到episode结束:
   - 选择动作(探索或利用)
   - 执行动作获得新状态和奖励
   - 更新Q网络
   - 更新状态
3. 衰减探索率
```

6. 展示训练结果:
```python
# 使用训练好的模型演示
for _ in range(5):  # 展示5次
    state = env.reset()[0]
    while not done:
        action = model(state).argmax()  # 使用最优动作
        state, _, done, _, _ = env.step(action)
```

关键点:
- DQN combines深度学习和Q学习
- epsilon-greedy平衡探索和利用
- 使用target网络稳定训练
- 逐渐减小探索率
- 通过可视化直观展示学习效果