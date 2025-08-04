// src/components/MemoViewer.tsx
import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Memo, MEMO_CATEGORIES } from '@/types/memo';

// MarkdownEditor.Markdown만 동적으로 import
const MarkdownPreview = dynamic(
  () => import('@uiw/react-markdown-editor').then(mod => ({ default: mod.default.Markdown })),
  { ssr: false }
);

interface MemoViewerProps {
  memo: Memo;
  onClose: () => void;
  onEdit: (memo: Memo) => void;
  onDelete: (id: string) => void;
}

const MemoViewer: React.FC<MemoViewerProps> = ({ memo, onClose, onEdit, onDelete }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && event.target === modalRef.current) {
      onClose();
    }
  };
  
  const handleEdit = () => {
    onEdit(memo);
  }

  const handleDelete = () => {
    onDelete(memo.id);
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      personal: 'bg-blue-100 text-blue-800 border-blue-200',
      work: 'bg-green-100 text-green-800 border-green-200',
      study: 'bg-purple-100 text-purple-800 border-purple-200',
      idea: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      other: 'bg-gray-100 text-gray-800 border-gray-200',
    }
    return colors[category as keyof typeof colors] || colors.other
  }

  return (
    <div 
      ref={modalRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 backdrop-blur-sm"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 ease-out">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(memo.category)}`}>
                  {MEMO_CATEGORIES[memo.category as keyof typeof MEMO_CATEGORIES] || memo.category}
                </span>
                <span className="text-sm text-gray-500">
                  📅 {formatDate(memo.updatedAt)}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                {memo.title}
              </h1>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white hover:bg-opacity-70 rounded-full transition-all duration-200"
              title="닫기"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* 내용 */}
        <div className="p-6 overflow-y-auto max-h-96">
          <div className="prose prose-gray max-w-none">
            <MarkdownPreview 
              source={memo.content} 
              style={{ 
                whiteSpace: 'initial',
                color: 'inherit',
                fontSize: 'inherit',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* 태그 */}
          {memo.tags.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-3">🏷️ 태그</h3>
              <div className="flex gap-2 flex-wrap">
                {memo.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm rounded-full border border-indigo-100 hover:bg-indigo-100 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 액션 버튼 */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
          <div className="flex justify-end gap-3">
            <button
              onClick={handleEdit}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              수정
            </button>
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 shadow-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoViewer;
