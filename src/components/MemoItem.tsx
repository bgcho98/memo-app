'use client'

import { Memo, MEMO_CATEGORIES } from '@/types/memo'
import dynamic from 'next/dynamic'

// MarkdownEditor.Markdown만 동적으로 import
const MarkdownPreview = dynamic(
  () => import('@uiw/react-markdown-editor').then(mod => ({ default: mod.default.Markdown })),
  { ssr: false }
)

interface MemoItemProps {
  memo: Memo
  onView: () => void
  onEdit: (memo: Memo) => void
  onDelete: (id: string) => void
}

export default function MemoItem({ memo, onView, onEdit, onDelete }: MemoItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      personal: 'bg-blue-50 text-blue-700 border-blue-200',
      work: 'bg-green-50 text-green-700 border-green-200',
      study: 'bg-purple-50 text-purple-700 border-purple-200',
      idea: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      other: 'bg-gray-50 text-gray-700 border-gray-200',
    }
    return colors[category as keyof typeof colors] || colors.other
  }
  
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(memo);
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('정말로 이 메모를 삭제하시겠습니까?')) {
      onDelete(memo.id)
    }
  }

  return (
    <div 
      className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-xl hover:scale-[1.02] hover:border-blue-300 transition-all duration-300 cursor-pointer group"
      onClick={onView}
    >
      {/* 헤더 */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-700 transition-colors">
            {memo.title}
          </h3>
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(memo.category)}`}
            >
              {MEMO_CATEGORIES[memo.category as keyof typeof MEMO_CATEGORIES] ||
                memo.category}
            </span>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatDate(memo.updatedAt)}
            </span>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleEditClick}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200 hover:scale-110"
            title="편집"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={handleDeleteClick}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200 hover:scale-110"
            title="삭제"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* 내용 */}
      <div className="mb-5">
        <div className="text-gray-600 text-sm leading-relaxed line-clamp-3 group-hover:text-gray-700 transition-colors prose prose-sm prose-gray max-w-none [&>*]:!my-0 [&>*]:!mb-1">
          <MarkdownPreview 
            source={memo.content.length > 100 ? memo.content.substring(0, 100) + '...' : memo.content}
            style={{ 
              color: 'inherit',
              fontSize: 'inherit',
              fontFamily: 'inherit',
              lineHeight: 'inherit'
            }}
          />
        </div>
      </div>

      {/* 태그 */}
      {memo.tags.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {memo.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 text-xs rounded-full border border-gray-200 hover:border-blue-300 transition-colors"
            >
              #{tag}
            </span>
          ))}
          {memo.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded-full border border-gray-200">
              +{memo.tags.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
