'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { FontFamily } from '@tiptap/extension-font-family'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import CodeBlock from '@tiptap/extension-code-block'
import Blockquote from '@tiptap/extension-blockquote'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import { useState, useRef, useEffect } from 'react'
import {
  BoldIcon,
  ItalicIcon,
  ListBulletIcon,
  LinkIcon,
  PhotoIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  CodeBracketIcon,
  TableCellsIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  PaintBrushIcon,
  ChevronDownIcon,
  Bars3BottomLeftIcon,
  MinusIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const [showImageDialog, setShowImageDialog] = useState(false)
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [showTableDialog, setShowTableDialog] = useState(false)
  const [showFontMenu, setShowFontMenu] = useState(false)
  const [showFontSizeMenu, setShowFontSizeMenu] = useState(false)
  const [showHeadingMenu, setShowHeadingMenu] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showHighlightPicker, setShowHighlightPicker] = useState(false)
  const [showAlignMenu, setShowAlignMenu] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')
  const [tableRows, setTableRows] = useState('3')
  const [tableCols, setTableCols] = useState('3')
  const [uploadingContentImage, setUploadingContentImage] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const imageFileInputRef = useRef<HTMLInputElement>(null)
  const editorContainerRef = useRef<HTMLDivElement>(null)

  const fonts = [
    'Arial',
    'Times New Roman',
    'Courier New',
    'Georgia',
    'Verdana',
    'Comic Sans MS',
    'Impact',
    'Trebuchet MS',
    'Palatino',
    'Garamond',
    'Bookman',
    'Tahoma',
    'Helvetica',
  ]

  const fontSizes = ['8', '9', '10', '11', '12', '14', '16', '18', '24', '30', '36', '48', '60', '72', '96']

  const colors = [
    '#000000', '#434343', '#666666', '#999999', '#B7B7B7', '#CCCCCC', '#D9D9D9', '#EFEFEF', '#F3F3F3', '#FFFFFF',
    '#980000', '#FF0000', '#FF9900', '#FFFF00', '#00FF00', '#00FFFF', '#4A86E8', '#0000FF', '#9900FF', '#FF00FF',
    '#E6B8AF', '#F4CCCC', '#FCE5CD', '#FFF2CC', '#D9EAD3', '#D0E0E3', '#C9DAF8', '#CFE2F3', '#D9D2E9', '#EAD1DC',
    '#DD7E6B', '#EA9999', '#F9CB9C', '#FFE599', '#B6D7A8', '#A2C4C9', '#A4C2F4', '#9FC5E8', '#B4A7D6', '#D5A6BD',
    '#CC4125', '#E06666', '#F6B26B', '#FFD966', '#93C47D', '#76A5AF', '#6D9EEB', '#6FA8DC', '#8E7CC3', '#C27BA0',
    '#A61C00', '#CC0000', '#E69138', '#F1C232', '#6AA84F', '#45818E', '#3C78D8', '#3D85C6', '#674EA7', '#A64D79',
    '#85200C', '#990000', '#B45F06', '#BF9000', '#38761D', '#134F5C', '#1155CC', '#0B5394', '#351C75', '#741B47',
    '#5B0F00', '#660000', '#783F04', '#7F6000', '#274E13', '#0C343D', '#1C4587', '#073763', '#20124D', '#4C1130',
  ]

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded my-2',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300',
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      TextStyle,
      Color,
      FontFamily.configure({
        types: ['textStyle'],
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse table-auto w-full my-4',
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2 font-semibold text-left',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 dark:border-gray-600 px-3 py-2',
        },
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class: 'bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 rounded my-2 font-mono text-sm overflow-x-auto border border-gray-200 dark:border-gray-700',
        },
      }),
      Blockquote.configure({
        HTMLAttributes: {
          class: 'border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-2 text-gray-700 dark:text-gray-300',
        },
      }),
      HorizontalRule.configure({
        HTMLAttributes: {
          class: 'my-4 border-gray-300 dark:border-gray-600',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none focus:outline-none px-16 py-4 min-h-[500px]',
        style: `background: ${isFullscreen ? '#fff' : 'transparent'}; color: #000; font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.6;`,
      },
    },
  })

  useEffect(() => {
    if (editor && isFullscreen) {
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsFullscreen(false)
        }
      }
      document.addEventListener('keydown', handleEsc)
      return () => document.removeEventListener('keydown', handleEsc)
    }
  }, [editor, isFullscreen])

  if (!editor) {
    return null
  }

  const uploadContentImage = async (file: File) => {
    try {
      setUploadingContentImage(true)

      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to upload image')
      }

      const data = await response.json()
      editor.chain().focus().setImage({ src: data.url }).run()
    } catch (error) {
      console.error('Failed to upload image:', error)
      alert(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setUploadingContentImage(false)
    }
  }

  const handleContentImageFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        alert('Image size must be less than 10MB')
        return
      }
      uploadContentImage(file)
      setShowImageDialog(false)
    }
  }

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run()
      setImageUrl('')
      setShowImageDialog(false)
    }
  }

  const addLink = () => {
    if (linkUrl) {
      if (linkText) {
        editor.chain().focus().insertContent(`<a href="${linkUrl}">${linkText}</a>`).run()
      } else {
        editor.chain().focus().setLink({ href: linkUrl }).run()
      }
      setLinkUrl('')
      setLinkText('')
      setShowLinkDialog(false)
    }
  }

  const insertTable = () => {
    const rows = parseInt(tableRows) || 3
    const cols = parseInt(tableCols) || 3
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run()
    setShowTableDialog(false)
    setTableRows('3')
    setTableCols('3')
  }

  const getCurrentFontSize = () => {
    const fontSize = editor.getAttributes('textStyle').fontSize
    if (fontSize) {
      return fontSize.replace('pt', '')
    }
    return '11'
  }

  const getCurrentHeading = () => {
    if (editor.isActive('heading', { level: 1 })) return 'Heading 1'
    if (editor.isActive('heading', { level: 2 })) return 'Heading 2'
    if (editor.isActive('heading', { level: 3 })) return 'Heading 3'
    return 'Normal text'
  }

  const getCurrentFont = () => {
    const fontFamily = editor.getAttributes('textStyle').fontFamily
    return fontFamily || 'Arial'
  }

  return (
    <div
      ref={editorContainerRef}
      className={`bg-white dark:bg-gray-800 ${
        isFullscreen ? 'fixed inset-0 z-50' : 'rounded-lg border border-gray-300 dark:border-gray-700'
      }`}
    >
      {/* Google Docs Style Toolbar */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-2 py-1">
        <div className="flex items-center gap-1 flex-wrap">
          {/* Undo / Redo */}
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30"
            disabled={!editor.can().undo()}
            title="Undo (Ctrl+Z)"
          >
            <ArrowUturnLeftIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30"
            disabled={!editor.can().redo()}
            title="Redo (Ctrl+Y)"
          >
            <ArrowUturnRightIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

          {/* Heading Style */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowHeadingMenu(!showHeadingMenu)
                setShowFontMenu(false)
                setShowFontSizeMenu(false)
                setShowAlignMenu(false)
                setShowMoreMenu(false)
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]"
            >
              <span className="flex-1 text-left truncate">{getCurrentHeading()}</span>
              <ChevronDownIcon className="h-4 w-4" />
            </button>
            {showHeadingMenu && (
              <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 min-w-[180px]">
                {['Normal text', 'Heading 1', 'Heading 2', 'Heading 3'].map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => {
                      if (style === 'Normal text') {
                        editor.chain().focus().setParagraph().run()
                      } else if (style === 'Heading 1') {
                        editor.chain().focus().toggleHeading({ level: 1 }).run()
                      } else if (style === 'Heading 2') {
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                      } else if (style === 'Heading 3') {
                        editor.chain().focus().toggleHeading({ level: 3 }).run()
                      }
                      setShowHeadingMenu(false)
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                  >
                    {style}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

          {/* Font Family */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowFontMenu(!showFontMenu)
                setShowHeadingMenu(false)
                setShowFontSizeMenu(false)
                setShowAlignMenu(false)
                setShowMoreMenu(false)
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 min-w-[140px]"
            >
              <span className="flex-1 text-left truncate">{getCurrentFont()}</span>
              <ChevronDownIcon className="h-4 w-4" />
            </button>
            {showFontMenu && (
              <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto">
                {fonts.map((font) => (
                  <button
                    key={font}
                    type="button"
                    onClick={() => {
                      editor.chain().focus().setFontFamily(font).run()
                      setShowFontMenu(false)
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm whitespace-nowrap"
                    style={{ fontFamily: font }}
                  >
                    {font}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Font Size */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowFontSizeMenu(!showFontSizeMenu)
                setShowFontMenu(false)
                setShowHeadingMenu(false)
                setShowAlignMenu(false)
                setShowMoreMenu(false)
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 min-w-[60px]"
            >
              <span className="flex-1 text-left">{getCurrentFontSize()}</span>
              <ChevronDownIcon className="h-4 w-4" />
            </button>
            {showFontSizeMenu && (
              <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto">
                {fontSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      editor.chain().focus().setMark('textStyle', { fontSize: `${size}pt` }).run()
                      setShowFontSizeMenu(false)
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

          {/* Bold, Italic, Underline */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
              editor.isActive('bold') ? 'bg-gray-200 dark:bg-gray-700' : ''
            }`}
            title="Bold (Ctrl+B)"
          >
            <BoldIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
              editor.isActive('italic') ? 'bg-gray-200 dark:bg-gray-700' : ''
            }`}
            title="Italic (Ctrl+I)"
          >
            <ItalicIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
              editor.isActive('underline') ? 'bg-gray-200 dark:bg-gray-700' : ''
            }`}
            title="Underline (Ctrl+U)"
          >
            <span className="text-base font-semibold underline text-gray-700 dark:text-gray-300">U</span>
          </button>

          {/* Text Color */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowColorPicker(!showColorPicker)
                setShowHighlightPicker(false)
              }}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              title="Text color"
            >
              <span className="text-lg font-bold text-gray-700 dark:text-gray-300" style={{ color: editor.getAttributes('textStyle').color || '#000000' }}>
                A
              </span>
            </button>
            {showColorPicker && (
              <div className="absolute top-full left-0 mt-1 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-20">
                <div className="grid grid-cols-10 gap-1 mb-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => {
                        editor.chain().focus().setColor(color).run()
                        setShowColorPicker(false)
                      }}
                      className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().unsetColor().run()
                    setShowColorPicker(false)
                  }}
                  className="w-full px-3 py-1 text-xs border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Reset color
                </button>
              </div>
            )}
          </div>

          {/* Highlight Color */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowHighlightPicker(!showHighlightPicker)
                setShowColorPicker(false)
              }}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              title="Highlight color"
            >
              <PaintBrushIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </button>
            {showHighlightPicker && (
              <div className="absolute top-full left-0 mt-1 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-20">
                <div className="grid grid-cols-10 gap-1 mb-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => {
                        editor.chain().focus().toggleHighlight({ color }).run()
                        setShowHighlightPicker(false)
                      }}
                      className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().unsetHighlight().run()
                    setShowHighlightPicker(false)
                  }}
                  className="w-full px-3 py-1 text-xs border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  No color
                </button>
              </div>
            )}
          </div>

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

          {/* Link */}
          <button
            type="button"
            onClick={() => setShowLinkDialog(true)}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            title="Insert link"
          >
            <LinkIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>

          {/* Image */}
          <button
            type="button"
            onClick={() => setShowImageDialog(true)}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            title="Insert image"
          >
            <PhotoIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

          {/* Align */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowAlignMenu(!showAlignMenu)
                setShowFontMenu(false)
                setShowFontSizeMenu(false)
                setShowHeadingMenu(false)
                setShowMoreMenu(false)
              }}
              className="flex items-center gap-1 px-2 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              title="Text align"
            >
              <Bars3BottomLeftIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              <ChevronDownIcon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
            </button>
            {showAlignMenu && (
              <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20">
                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().setTextAlign('left').run()
                    setShowAlignMenu(false)
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm flex items-center gap-2"
                >
                  <Bars3BottomLeftIcon className="h-4 w-4" />
                  Left
                </button>
                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().setTextAlign('center').run()
                    setShowAlignMenu(false)
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm flex items-center gap-2"
                >
                  <MinusIcon className="h-4 w-4" />
                  Center
                </button>
                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().setTextAlign('right').run()
                    setShowAlignMenu(false)
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm flex items-center gap-2"
                >
                  <Bars3BottomLeftIcon className="h-4 w-4 scale-x-[-1]" />
                  Right
                </button>
                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().setTextAlign('justify').run()
                    setShowAlignMenu(false)
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm flex items-center gap-2"
                >
                  <MinusIcon className="h-4 w-4" />
                  Justify
                </button>
              </div>
            )}
          </div>

          {/* Bullet List */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
              editor.isActive('bulletList') ? 'bg-gray-200 dark:bg-gray-700' : ''
            }`}
            title="Bulleted list"
          >
            <ListBulletIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>

          {/* Numbered List */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
              editor.isActive('orderedList') ? 'bg-gray-200 dark:bg-gray-700' : ''
            }`}
            title="Numbered list"
          >
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">1.</span>
          </button>

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

          {/* More Options */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowMoreMenu(!showMoreMenu)
                setShowFontMenu(false)
                setShowFontSizeMenu(false)
                setShowHeadingMenu(false)
                setShowAlignMenu(false)
              }}
              className="px-2 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300"
              title="More options"
            >
              •••
            </button>
            {showMoreMenu && (
              <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 min-w-[180px]">
                <button
                  type="button"
                  onClick={() => {
                    setShowTableDialog(true)
                    setShowMoreMenu(false)
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm flex items-center gap-2"
                >
                  <TableCellsIcon className="h-4 w-4" />
                  Insert table
                </button>
                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().toggleCodeBlock().run()
                    setShowMoreMenu(false)
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm flex items-center gap-2"
                >
                  <CodeBracketIcon className="h-4 w-4" />
                  Code block
                </button>
                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().toggleBlockquote().run()
                    setShowMoreMenu(false)
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm flex items-center gap-2"
                >
                  <span className="font-bold">"</span>
                  Quote
                </button>
                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().setHorizontalRule().run()
                    setShowMoreMenu(false)
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm flex items-center gap-2"
                >
                  <MinusIcon className="h-4 w-4" />
                  Horizontal line
                </button>
              </div>
            )}
          </div>

          {/* Fullscreen */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ml-auto"
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? (
              <ArrowsPointingInIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            ) : (
              <ArrowsPointingOutIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            )}
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div
        className={`bg-white dark:bg-gray-800 overflow-y-auto ${
          isFullscreen ? 'h-[calc(100vh-48px)]' : 'max-h-[600px]'
        }`}
        style={{
          background: isFullscreen ? '#f9f9f9' : 'white',
        }}
      >
        <div className={`mx-auto ${isFullscreen ? 'max-w-[816px] my-8 bg-white shadow-lg' : ''}`}>
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Image Dialog */}
      {showImageDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Insert image</h3>
            <div className="mb-4">
              <input
                ref={imageFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleContentImageFileSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => imageFileInputRef.current?.click()}
                disabled={uploadingContentImage}
                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded hover:border-blue-400 transition-colors disabled:opacity-50"
              >
                {uploadingContentImage ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    Uploading...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300">
                    <PhotoIcon className="h-5 w-5" />
                    Upload from computer
                  </span>
                )}
              </button>
            </div>
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">OR</span>
              </div>
            </div>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Paste image URL"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white mb-4"
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowImageDialog(false)
                  setImageUrl('')
                }}
                className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={addImage}
                disabled={!imageUrl}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Insert link</h3>
            <input
              type="text"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              placeholder="Text to display (optional)"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white mb-3"
            />
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="Link URL"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white mb-4"
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowLinkDialog(false)
                  setLinkUrl('')
                  setLinkText('')
                }}
                className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={addLink}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table Dialog */}
      {showTableDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Insert table</h3>
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Rows</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={tableRows}
                  onChange={(e) => setTableRows(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Columns</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={tableCols}
                  onChange={(e) => setTableCols(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowTableDialog(false)
                  setTableRows('3')
                  setTableCols('3')
                }}
                className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={insertTable}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
