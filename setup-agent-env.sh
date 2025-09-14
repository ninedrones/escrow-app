#!/bin/bash

# Agent mode環境設定スクリプト
# Homebrewのパスを追加してNode.js関連ツールを利用可能にする

export PATH="/opt/homebrew/bin:$PATH"

# パッケージマネージャーの確認
echo "=== パッケージマネージャー確認 ==="
echo "Node.js: $(which node) - $(node --version)"
echo "npm: $(which npm) - $(npm --version)"
echo "pnpm: $(which pnpm) - $(pnpm --version)"

# プロジェクトディレクトリに移動
cd /Users/yanlee/project/ETHTokyo25/escrow-app

echo "=== プロジェクトディレクトリ: $(pwd) ==="

# 依存関係のインストール確認
if [ ! -d "node_modules" ]; then
    echo "依存関係をインストール中..."
    pnpm install
else
    echo "依存関係は既にインストール済み"
fi

echo "=== 環境設定完了 ==="
