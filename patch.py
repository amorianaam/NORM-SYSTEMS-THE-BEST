import sys

filepath = 'C:/Users/Elite/Desktop/norm-system/src/pages/cms/CMSInsights.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target_start = '                {formLang === "en" ? ('
target_end = '              <div className="flex justify-end gap-3 pt-6 border-t mt-8">'

start_idx = content.find(target_start)
end_idx = content.find(target_end)

if start_idx == -1 or end_idx == -1:
    print('Failed to find boundaries')
    sys.exit(1)

new_form_content = """                {/* ENGLISH COLUMN */}
                <div className="space-y-6 bg-white/5 p-6 rounded-2xl border border-white/10" dir="ltr">
                  <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <h4 className="font-bold text-white uppercase tracking-widest text-sm">
                      English Details
                    </h4>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Title (EN)</label>
                    <input
                      required
                      className="w-full px-4 py-3 border border-white/10 rounded-xl text-sm bg-white/5 text-white focus:bg-white/10 focus:border-magenta focus:ring-2 focus:ring-magenta/20 outline-none transition-all"
                      value={formData.title_en}
                      onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Summary (EN)</label>
                    <textarea
                      required
                      className="w-full px-4 py-3 border border-white/10 rounded-xl text-sm bg-white/5 text-white focus:bg-white/10 focus:border-magenta focus:ring-2 focus:ring-magenta/20 outline-none transition-all h-24 resize-none"
                      value={formData.summary_en}
                      onChange={(e) => setFormData({ ...formData, summary_en: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Category (EN)</label>
                    <input
                      required
                      placeholder="e.g. Logic, Governance, Investment..."
                      className="w-full px-4 py-3 border border-white/10 rounded-xl text-sm bg-white/5 text-white focus:bg-white/10 focus:border-magenta focus:ring-2 focus:ring-magenta/20 outline-none transition-all"
                      value={formData.category_en}
                      onChange={(e) => setFormData({ ...formData, category_en: e.target.value })}
                    />
                  </div>

                  {/* English PDF Zone */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">PDF Document (EN)</label>
                    {existingPdfEn && !removePdfEn && !pdfFileEn && (
                      <div className="mb-2 p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                        <span className="text-xs font-bold text-white truncate pr-4">Current EN PDF Available</span>
                        <div className="flex items-center gap-2">
                          <a href={existingPdfEn} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200">
                            <Eye className="w-4 h-4" />
                          </a>
                          <button type="button" onClick={() => setRemovePdfEn(true)} className="text-red-400 hover:text-red-300 transition-colors duration-200">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                    {(!existingPdfEn || removePdfEn || pdfFileEn) && (
                      <div className="relative group cursor-pointer w-full bg-white/5 hover:bg-white/10 border-2 border-dashed border-white/20 hover:border-magenta hover:shadow-[0_0_15px_rgba(255,0,255,0.15)] rounded-xl p-6 text-center transition-all duration-300">
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => {
                            setPdfFileEn(e.target.files ? e.target.files[0] : null);
                            if (e.target.files && e.target.files.length > 0) setRemovePdfEn(false);
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="p-3 rounded-full bg-white/5 group-hover:bg-magenta/20 transition-colors duration-300">
                            <FileText className="w-6 h-6 text-gray-400 group-hover:text-magenta transition-colors duration-200" />
                          </div>
                          <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors duration-300">
                            {pdfFileEn ? pdfFileEn.name : isAr ? "اختر ملف PDF (EN)" : "Drop English PDF here or click"}
                          </span>
                        </div>
                      </div>
                    )}
                    {removePdfEn && existingPdfEn && !pdfFileEn && (
                      <div className="mt-2 text-xs text-red-400 flex items-center justify-between">
                        <span>EN PDF will be removed</span>
                        <button type="button" onClick={() => setRemovePdfEn(false)} className="text-gray-400 hover:text-white underline">Undo</button>
                      </div>
                    )}
                  </div>
                </div>

                {/* ARABIC COLUMN */}
                <div className="space-y-6 bg-white/5 p-6 rounded-2xl border border-white/10" dir="rtl">
                  <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <h4 className="font-bold text-white tracking-widest text-sm">
                      التفاصيل باللغة العربية
                    </h4>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">العنوان (AR)</label>
                    <input
                      required
                      dir="rtl"
                      className="w-full px-4 py-3 border border-white/10 rounded-xl text-sm bg-white/5 text-white focus:bg-white/10 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                      value={formData.title_ar}
                      onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">الملخص (AR)</label>
                    <textarea
                      required
                      dir="rtl"
                      className="w-full px-4 py-3 border border-white/10 rounded-xl text-sm bg-white/5 text-white focus:bg-white/10 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all h-24 resize-none"
                      value={formData.summary_ar}
                      onChange={(e) => setFormData({ ...formData, summary_ar: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">التصنيف (AR)</label>
                    <input
                      required
                      dir="rtl"
                      placeholder="مثال: المنهجية، الحوكمة، الاستثمار..."
                      className="w-full px-4 py-3 border border-white/10 rounded-xl text-sm bg-white/5 text-white focus:bg-white/10 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                      value={formData.category_ar}
                      onChange={(e) => setFormData({ ...formData, category_ar: e.target.value })}
                    />
                  </div>

                  {/* Arabic PDF Zone */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">ملف PDF (AR)</label>
                    {existingPdfAr && !removePdfAr && !pdfFileAr && (
                      <div className="mb-2 p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                        <span className="text-xs font-bold text-white truncate pl-4">ملف PDF العربي متاح</span>
                        <div className="flex items-center gap-2">
                          <a href={existingPdfAr} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200">
                            <Eye className="w-4 h-4" />
                          </a>
                          <button type="button" onClick={() => setRemovePdfAr(true)} className="text-red-400 hover:text-red-300 transition-colors duration-200">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                    {(!existingPdfAr || removePdfAr || pdfFileAr) && (
                      <div className="relative group cursor-pointer w-full bg-white/5 hover:bg-white/10 border-2 border-dashed border-white/20 hover:border-emerald-500 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] rounded-xl p-6 text-center transition-all duration-300">
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => {
                            setPdfFileAr(e.target.files ? e.target.files[0] : null);
                            if (e.target.files && e.target.files.length > 0) setRemovePdfAr(false);
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="p-3 rounded-full bg-white/5 group-hover:bg-emerald-500/20 transition-colors duration-300">
                            <FileText className="w-6 h-6 text-gray-400 group-hover:text-emerald-500 transition-colors duration-200" />
                          </div>
                          <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors duration-300">
                            {pdfFileAr ? pdfFileAr.name : isAr ? "قم بإسقاط ملف PDF هنا أو انقر للاختيار" : "Drop Arabic PDF here"}
                          </span>
                        </div>
                      </div>
                    )}
                    {removePdfAr && existingPdfAr && !pdfFileAr && (
                      <div className="mt-2 text-xs text-red-400 flex items-center justify-between">
                        <span>سيتم حذف ملف PDF العربي</span>
                        <button type="button" onClick={() => setRemovePdfAr(false)} className="text-gray-400 hover:text-white underline">تراجع</button>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              <div className="flex justify-end gap-4 pt-8 border-t border-white/10">
"""

new_content = content[:start_idx] + new_form_content + content[end_idx + 64:]

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(new_content)

print('Success')
