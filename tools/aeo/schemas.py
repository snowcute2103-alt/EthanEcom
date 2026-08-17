"""Pydantic models mô tả output Claude phải sinh ra — dùng làm output_format cho
client.messages.parse(), đảm bảo JSON hợp lệ 100% (không cần parse/validate thủ công)."""
from pydantic import BaseModel, Field


class QAPair(BaseModel):
    question: str = Field(description="Câu hỏi viết theo ngôn ngữ tự nhiên, đúng cách người dùng thật sẽ hỏi")
    answer: str = Field(description="Câu trả lời tự-chứa (không cần đọc phần khác), 40-90 từ, đúng sự thật từ nội dung gốc")


class FAQGeneration(BaseModel):
    questions: list[QAPair] = Field(description="3-6 cặp hỏi-đáp, chỉ dựa trên nội dung đã cho — KHÔNG bịa thông tin")


class ArticleGeneration(BaseModel):
    headline: str = Field(description="Tiêu đề ngắn gọn, tối đa 110 ký tự")
    description: str = Field(description="Mô tả ngắn 1-2 câu, 70-160 ký tự, dùng cho meta description")
    keywords: list[str] = Field(description="3-6 từ khóa/cụm từ chính của bài viết")
