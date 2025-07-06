#include <stdio.h>
#include <stdlib.h>

#define VOCAB_SIZE 28  // 根据之前的词表大小
#define EMBED_DIM 5    // 嵌入向量的维度，这里用5作为示例

// 模拟的嵌入矩阵（在实际应用中，这通常是预训练的或在训练过程中学习的）
float embedding_matrix[VOCAB_SIZE][EMBED_DIM] = {
    {0.1, 0.2, 0.3, 0.4, 0.5},  // ID 0 ("the")
    {0.2, 0.3, 0.4, 0.5, 0.6},  // ID 1 ("quick")
    {0.3, 0.4, 0.5, 0.6, 0.7},  // ID 2 ("a")
    {0.4, 0.5, 0.6, 0.7, 0.8},  // ID 3 ("b")
    // ... 其他词的嵌入向量 ...
};

// 函数：将单个token ID转换为嵌入向量
void embed_token(int token_id, float* output) {
    if (token_id < 0 || token_id >= VOCAB_SIZE) {
        printf("Error: Token ID out of range\n");
        return;
    }
    for (int i = 0; i < EMBED_DIM; i++) {
        output[i] = embedding_matrix[token_id][i];
    }
}

// 函数：将一系列token ID转换为嵌入向量序列
void embed_sequence(int* token_ids, int sequence_length, float** output) {
    for (int i = 0; i < sequence_length; i++) {
        embed_token(token_ids[i], output[i]);
    }
}

// 辅助函数：打印嵌入向量
void print_embedding(float* embedding) {
    printf("[");
    for (int i = 0; i < EMBED_DIM; i++) {
        printf("%.2f", embedding[i]);
        if (i < EMBED_DIM - 1) printf(", ");
    }
    printf("]\n");
}

int main() {
    // 示例输入：来自tokenizer的token ID序列
    int token_ids[] = {0, 1, 3, 19, 16, 24, 15};  // "the quick brown"
    int sequence_length = sizeof(token_ids) / sizeof(token_ids[0]);

    // 为嵌入向量分配内存
    float** embedded_sequence = (float**)malloc(sequence_length * sizeof(float*));
    for (int i = 0; i < sequence_length; i++) {
        embedded_sequence[i] = (float*)malloc(EMBED_DIM * sizeof(float));
    }

    // 执行嵌入
    embed_sequence(token_ids, sequence_length, embedded_sequence);

    // 打印结果
    printf("Embedded sequence:\n");
    for (int i = 0; i < sequence_length; i++) {
        printf("Token %d: ", token_ids[i]);
        print_embedding(embedded_sequence[i]);
    }

    // 释放内存
    for (int i = 0; i < sequence_length; i++) {
        free(embedded_sequence[i]);
    }
    free(embedded_sequence);

    return 0;
}