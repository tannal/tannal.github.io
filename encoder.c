#include <stdio.h>
#include <stdlib.h>
#include <math.h>

#define SEQ_LEN 7
#define EMBED_DIM 5
#define NUM_HEADS 2
#define FF_DIM 8

// 辅助函数：打印向量
void print_vector(float* vec, int size) {
    printf("[");
    for (int i = 0; i < size; i++) {
        printf("%.2f", vec[i]);
        if (i < size - 1) printf(", ");
    }
    printf("]\n");
}

// 多头注意力 (非常简化版本)
void multi_head_attention(float input[SEQ_LEN][EMBED_DIM], float output[SEQ_LEN][EMBED_DIM]) {
    // 这里我们简化了多头注意力的实现
    // 在实际应用中，这将涉及查询、键和值的线性变换，以及注意力权重的计算
    for (int i = 0; i < SEQ_LEN; i++) {
        for (int j = 0; j < EMBED_DIM; j++) {
            output[i][j] = 0;
            for (int k = 0; k < SEQ_LEN; k++) {
                output[i][j] += input[k][j] / SEQ_LEN;
            }
        }
    }
}

// 层归一化 (简化版本)
void layer_norm(float input[SEQ_LEN][EMBED_DIM], float output[SEQ_LEN][EMBED_DIM]) {
    for (int i = 0; i < SEQ_LEN; i++) {
        float mean = 0, var = 0;
        for (int j = 0; j < EMBED_DIM; j++) {
            mean += input[i][j];
        }
        mean /= EMBED_DIM;
        for (int j = 0; j < EMBED_DIM; j++) {
            var += (input[i][j] - mean) * (input[i][j] - mean);
        }
        var /= EMBED_DIM;
        for (int j = 0; j < EMBED_DIM; j++) {
            output[i][j] = (input[i][j] - mean) / sqrt(var + 1e-5);
        }
    }
}

// 前馈神经网络 (简化版本)
void feed_forward(float input[SEQ_LEN][EMBED_DIM], float output[SEQ_LEN][EMBED_DIM]) {
    float temp[SEQ_LEN][FF_DIM];
    // 第一层: EMBED_DIM -> FF_DIM
    for (int i = 0; i < SEQ_LEN; i++) {
        for (int j = 0; j < FF_DIM; j++) {
            temp[i][j] = 0;
            for (int k = 0; k < EMBED_DIM; k++) {
                temp[i][j] += input[i][k] * 0.1; // 0.1 是简化的权重
            }
            temp[i][j] = temp[i][j] > 0 ? temp[i][j] : 0; // ReLU激活
        }
    }
    // 第二层: FF_DIM -> EMBED_DIM
    for (int i = 0; i < SEQ_LEN; i++) {
        for (int j = 0; j < EMBED_DIM; j++) {
            output[i][j] = 0;
            for (int k = 0; k < FF_DIM; k++) {
                output[i][j] += temp[i][k] * 0.1; // 0.1 是简化的权重
            }
        }
    }
}

// 编码器层
void encoder_layer(float input[SEQ_LEN][EMBED_DIM], float output[SEQ_LEN][EMBED_DIM]) {
    float temp1[SEQ_LEN][EMBED_DIM], temp2[SEQ_LEN][EMBED_DIM];
    
    // 多头注意力
    multi_head_attention(input, temp1);
    
    // 第一个残差连接和层归一化
    for (int i = 0; i < SEQ_LEN; i++) {
        for (int j = 0; j < EMBED_DIM; j++) {
            temp1[i][j] += input[i][j];
        }
    }
    layer_norm(temp1, temp2);
    
    // 前馈神经网络
    feed_forward(temp2, temp1);
    
    // 第二个残差连接和层归一化
    for (int i = 0; i < SEQ_LEN; i++) {
        for (int j = 0; j < EMBED_DIM; j++) {
            temp1[i][j] += temp2[i][j];
        }
    }
    layer_norm(temp1, output);
}

int main() {
    // 示例输入：嵌入向量序列
    float input[SEQ_LEN][EMBED_DIM] = {
        {0.1, 0.2, 0.3, 0.4, 0.5},
        {0.2, 0.3, 0.4, 0.5, 0.6},
        {0.3, 0.4, 0.5, 0.6, 0.7},
        {0.4, 0.5, 0.6, 0.7, 0.8},
        {0.5, 0.6, 0.7, 0.8, 0.9},
        {0.6, 0.7, 0.8, 0.9, 1.0},
        {0.7, 0.8, 0.9, 1.0, 1.1}
    };

    float output[SEQ_LEN][EMBED_DIM];

    // 运行编码器层
    encoder_layer(input, output);

    // 打印结果
    printf("Input sequence:\n");
    for (int i = 0; i < SEQ_LEN; i++) {
        printf("Token %d: ", i);
        print_vector(input[i], EMBED_DIM);
    }

    printf("\nEncoded sequence:\n");
    for (int i = 0; i < SEQ_LEN; i++) {
        printf("Token %d: ", i);
        print_vector(output[i], EMBED_DIM);
    }

    return 0;
}