/* Cơ sở tri thức: triệu chứng, bệnh thường gặp, nhóm thuốc không kê đơn.
 * Chỉ mang tính tham khảo giáo dục, KHÔNG thay thế chẩn đoán của bác sĩ. */
(function (root) {
  const SYMPTOMS = [
    { id: 'sot', label: 'Sốt', group: 'Toàn thân' },
    { id: 'on_lanh', label: 'Ớn lạnh / rét run', group: 'Toàn thân' },
    { id: 'met_moi', label: 'Mệt mỏi, uể oải', group: 'Toàn thân' },
    { id: 'dau_co', label: 'Đau nhức cơ, đau mình mẩy', group: 'Toàn thân' },
    { id: 'dau_sau_mat', label: 'Đau sau hốc mắt', group: 'Toàn thân' },
    { id: 'phat_ban', label: 'Phát ban / nổi mẩn đỏ', group: 'Toàn thân' },
    { id: 'xuat_huyet', label: 'Chảy máu chân răng / chấm xuất huyết dưới da', group: 'Toàn thân' },
    { id: 'mat_vi_giac', label: 'Mất vị giác / khứu giác', group: 'Toàn thân' },

    { id: 'ho_khan', label: 'Ho khan', group: 'Hô hấp / Tai mũi họng' },
    { id: 'ho_dam', label: 'Ho có đờm', group: 'Hô hấp / Tai mũi họng' },
    { id: 'so_mui', label: 'Nghẹt mũi', group: 'Hô hấp / Tai mũi họng' },
    { id: 'chay_mui', label: 'Chảy nước mũi', group: 'Hô hấp / Tai mũi họng' },
    { id: 'hat_hoi', label: 'Hắt hơi nhiều', group: 'Hô hấp / Tai mũi họng' },
    { id: 'dau_hong', label: 'Đau / rát họng', group: 'Hô hấp / Tai mũi họng' },
    { id: 'dau_vung_mat', label: 'Đau tức vùng mặt, trán, gò má', group: 'Hô hấp / Tai mũi họng' },
    { id: 'kho_tho', label: 'Khó thở / thở khò khè', group: 'Hô hấp / Tai mũi họng' },

    { id: 'dau_dau', label: 'Đau đầu', group: 'Thần kinh' },
    { id: 'dau_nua_dau', label: 'Đau một bên đầu, theo nhịp mạch đập', group: 'Thần kinh' },
    { id: 'nhay_cam_anh_sang', label: 'Sợ ánh sáng / tiếng ồn', group: 'Thần kinh' },
    { id: 'chong_mat', label: 'Chóng mặt', group: 'Thần kinh' },

    { id: 'buon_non', label: 'Buồn nôn', group: 'Tiêu hóa' },
    { id: 'non', label: 'Nôn ói', group: 'Tiêu hóa' },
    { id: 'tieu_chay', label: 'Tiêu chảy', group: 'Tiêu hóa' },
    { id: 'dau_bung_tren', label: 'Đau / nóng rát vùng thượng vị (trên rốn)', group: 'Tiêu hóa' },
    { id: 'dau_bung_quanh_ron', label: 'Đau quặn bụng', group: 'Tiêu hóa' },
    { id: 'o_chua', label: 'Ợ chua / ợ nóng, nóng rát sau xương ức', group: 'Tiêu hóa' },
    { id: 'day_bung', label: 'Đầy hơi, khó tiêu', group: 'Tiêu hóa' },

    { id: 'tieu_buot', label: 'Tiểu buốt / tiểu rát', group: 'Tiết niệu' },
    { id: 'tieu_nhieu', label: 'Tiểu nhiều lần, tiểu gấp', group: 'Tiết niệu' },
    { id: 'dau_bung_duoi', label: 'Đau vùng bụng dưới / trên xương mu', group: 'Tiết niệu' },

    { id: 'do_mat', label: 'Đỏ mắt', group: 'Mắt / Da' },
    { id: 'ngua_mat', label: 'Ngứa mắt, chảy nước mắt', group: 'Mắt / Da' },
    { id: 'ghen_mat', label: 'Ghèn mắt, dính mi sáng ngủ dậy', group: 'Mắt / Da' },
    { id: 'ngua_da', label: 'Ngứa da', group: 'Mắt / Da' },
  ];

  /* Dấu hiệu nguy hiểm: cần gọi 115 / đến cấp cứu ngay */
  const RED_FLAGS = [
    { id: 'rf_dau_nguc', label: 'Đau thắt ngực, đau tức ngực lan tay/hàm' },
    { id: 'rf_kho_tho', label: 'Khó thở nặng, môi tím tái' },
    { id: 'rf_lu_lan', label: 'Lú lẫn, co giật hoặc ngất xỉu' },
    { id: 'rf_cung_co', label: 'Cứng gáy kèm sốt cao, đau đầu dữ dội' },
    { id: 'rf_liet', label: 'Yếu liệt một bên người, méo miệng, nói khó' },
    { id: 'rf_chay_mau', label: 'Nôn ra máu, đi ngoài phân đen/có máu, chảy máu không cầm' },
    { id: 'rf_mat_nuoc', label: 'Mất nước nặng: khát dữ dội, tiểu rất ít, mắt trũng, lả người' },
    { id: 'rf_dau_bung_du', label: 'Đau bụng dữ dội, bụng cứng như gỗ' },
    { id: 'rf_dau_dau_set_danh', label: 'Đau đầu dữ dội đột ngột như "sét đánh"' },
  ];

  /* Nhóm thuốc: chỉ nêu hoạt chất/nhóm thuốc phổ biến để hỏi dược sĩ. */
  const DRUGS = {
    ha_sot: { group: 'Hạ sốt – giảm đau', examples: 'Paracetamol (acetaminophen)', note: 'Liều theo cân nặng/tuổi; không quá 4 g/ngày ở người lớn; thận trọng khi bệnh gan, nghiện rượu.' },
    nsaid: { group: 'Giảm đau – kháng viêm không steroid (NSAID)', examples: 'Ibuprofen', note: 'Uống sau ăn. Tránh nếu loét dạ dày, bệnh thận, hen suyễn nhạy cảm NSAID, phụ nữ có thai. TUYỆT ĐỐI không dùng khi nghi sốt xuất huyết.' },
    bu_nuoc: { group: 'Bù nước – điện giải', examples: 'Oresol (ORS)', note: 'Pha đúng hướng dẫn, uống từng ngụm nhỏ nhiều lần.' },
    xit_mui: { group: 'Rửa mũi / xịt mũi', examples: 'Nước muối sinh lý 0,9%; xịt mũi corticoid (theo tư vấn)', note: 'Thuốc co mạch xịt mũi không dùng quá 3–5 ngày.' },
    chong_di_ung: { group: 'Kháng histamin H1', examples: 'Cetirizine, Loratadine, Fexofenadine', note: 'Thế hệ cũ (chlorpheniramine) gây buồn ngủ; thận trọng khi lái xe.' },
    long_dam: { group: 'Long đờm / giảm ho', examples: 'Acetylcystein, Ambroxol, Bromhexin', note: 'Không dùng thuốc ức chế ho cho ho có đờm nhiều. Trẻ <2 tuổi cần bác sĩ chỉ định.' },
    ngam_ho: { group: 'Giảm đau họng tại chỗ', examples: 'Viên ngậm sát khuẩn họng, súc họng nước muối ấm', note: 'Uống nhiều nước ấm, tránh đồ lạnh/cay.' },
    khang_acid: { group: 'Trung hòa / giảm tiết acid dạ dày', examples: 'Antacid (nhôm/magie hydroxit), Alginate; PPI/H2 theo tư vấn dược sĩ', note: 'Dùng kéo dài >2 tuần cần khám. Cách xa thuốc khác ≥2 giờ.' },
    chong_non: { group: 'Chống nôn', examples: 'Domperidon (ngắn ngày), Oresol phối hợp', note: 'Chỉ dùng ngắn ngày theo hướng dẫn.' },
    men_vi_sinh: { group: 'Men vi sinh', examples: 'Lactobacillus, Saccharomyces boulardii', note: 'Hỗ trợ tiêu chảy; không thay thế bù nước.' },
    khang_sinh: { group: 'Kháng sinh (BẮT BUỘC có đơn bác sĩ)', examples: 'Do bác sĩ chỉ định sau khi khám/xét nghiệm', note: 'Không tự mua/dùng kháng sinh: gây kháng thuốc, dùng sai không có tác dụng với bệnh do virus.' },
    thuoc_mat: { group: 'Thuốc nhỏ mắt', examples: 'Nước muối sinh lý nhỏ mắt, nước mắt nhân tạo; kháng sinh nhỏ mắt khi bác sĩ chỉ định', note: 'Không dùng thuốc nhỏ mắt chứa corticoid khi chưa khám.' },
    thuoc_dau_nua: { group: 'Cắt cơn đau nửa đầu', examples: 'Paracetamol / Ibuprofen sớm khi có cơn; nhóm triptan cần kê đơn', note: 'Nằm phòng tối yên tĩnh; tránh lạm dụng thuốc giảm đau >10 ngày/tháng.' },
  };

  /* Bệnh: w = trọng số của triệu chứng (1–5). */
  const CONDITIONS = [
    {
      id: 'cam_lanh', name: 'Cảm lạnh thông thường', specialty: 'Nội tổng quát / Tai mũi họng',
      summary: 'Nhiễm virus đường hô hấp trên nhẹ, thường tự khỏi sau 7–10 ngày.',
      weights: { so_mui: 4, chay_mui: 4, hat_hoi: 3, dau_hong: 3, ho_khan: 2, met_moi: 1, sot: 1 },
      drugs: ['xit_mui', 'ha_sot', 'ngam_ho'],
      advice: ['Nghỉ ngơi, uống nhiều nước ấm.', 'Rửa mũi bằng nước muối sinh lý.', 'Đi khám nếu sốt >3 ngày hoặc triệu chứng nặng lên sau 7 ngày.'],
      facility: ['pharmacy', 'clinic'],
    },
    {
      id: 'cum', name: 'Cúm (Influenza)', specialty: 'Nội tổng quát',
      summary: 'Khởi phát đột ngột với sốt cao, đau mỏi người, mệt nhiều, ho khan.',
      weights: { sot: 5, on_lanh: 4, dau_co: 4, met_moi: 3, ho_khan: 3, dau_dau: 2, dau_hong: 2, so_mui: 1 },
      drugs: ['ha_sot', 'bu_nuoc', 'ngam_ho'],
      advice: ['Nghỉ ngơi, bù nước, đeo khẩu trang tránh lây.', 'Người già, trẻ nhỏ, thai phụ, bệnh nền nên đi khám sớm (có thể cần thuốc kháng virus theo đơn).'],
      facility: ['clinic', 'hospital', 'pharmacy'],
    },
    {
      id: 'covid', name: 'COVID-19 (cần xét nghiệm để xác định)', specialty: 'Truyền nhiễm / Nội tổng quát',
      summary: 'Triệu chứng giống cúm; mất vị giác/khứu giác là dấu hiệu gợi ý đặc trưng.',
      weights: { mat_vi_giac: 5, sot: 3, ho_khan: 3, dau_hong: 2, met_moi: 3, dau_co: 2, kho_tho: 2 },
      drugs: ['ha_sot', 'bu_nuoc'],
      advice: ['Tự test nhanh kháng nguyên; hạn chế tiếp xúc người khác.', 'Theo dõi SpO₂ nếu có máy; đi khám ngay nếu khó thở.'],
      facility: ['clinic', 'hospital'],
    },
    {
      id: 'viem_hong', name: 'Viêm họng', specialty: 'Tai mũi họng',
      summary: 'Viêm niêm mạc họng do virus hoặc vi khuẩn; vi khuẩn (liên cầu) cần kháng sinh theo đơn.',
      weights: { dau_hong: 5, sot: 2, ho_khan: 2, met_moi: 1, so_mui: 1 },
      drugs: ['ngam_ho', 'ha_sot', 'khang_sinh'],
      advice: ['Súc họng nước muối ấm, uống nước ấm.', 'Đi khám nếu họng có mủ trắng, sốt cao, đau khi nuốt nhiều >3 ngày.'],
      facility: ['clinic', 'pharmacy'],
    },
    {
      id: 'viem_xoang', name: 'Viêm xoang', specialty: 'Tai mũi họng',
      summary: 'Viêm các xoang cạnh mũi: nghẹt mũi, đau tức vùng mặt, dịch mũi đặc.',
      weights: { dau_vung_mat: 5, so_mui: 4, chay_mui: 3, dau_dau: 2, ho_dam: 1, sot: 1 },
      drugs: ['xit_mui', 'ha_sot', 'khang_sinh'],
      advice: ['Rửa mũi nước muối đều đặn, xông hơi ấm.', 'Triệu chứng >10 ngày hoặc sốt cao: đi khám để cân nhắc kháng sinh.'],
      facility: ['clinic', 'hospital'],
    },
    {
      id: 'viem_phe_quan', name: 'Viêm phế quản', specialty: 'Hô hấp / Nội tổng quát',
      summary: 'Ho kéo dài có đờm sau nhiễm trùng hô hấp; có thể khò khè nhẹ.',
      weights: { ho_dam: 5, ho_khan: 2, kho_tho: 3, met_moi: 2, sot: 2, dau_hong: 1 },
      drugs: ['long_dam', 'ha_sot', 'khang_sinh'],
      advice: ['Uống nhiều nước, tránh khói thuốc, bụi.', 'Ho >3 tuần, khó thở hoặc ho ra máu cần đi khám/chụp X-quang.'],
      facility: ['clinic', 'hospital'],
    },
    {
      id: 'di_ung', name: 'Viêm mũi dị ứng', specialty: 'Tai mũi họng / Dị ứng – miễn dịch',
      summary: 'Hắt hơi từng tràng, ngứa mũi/mắt, chảy mũi trong, không sốt.',
      weights: { hat_hoi: 5, chay_mui: 4, ngua_mat: 4, so_mui: 3, ngua_da: 2, phat_ban: 1 },
      drugs: ['chong_di_ung', 'xit_mui'],
      advice: ['Tránh tác nhân (bụi, phấn hoa, lông thú).', 'Nếu tái diễn thường xuyên, nên khám để làm test dị ứng.'],
      facility: ['pharmacy', 'clinic'],
    },
    {
      id: 'sxh', name: 'Sốt xuất huyết Dengue (nghi ngờ)', specialty: 'Truyền nhiễm / Nội tổng quát',
      summary: 'Sốt cao liên tục 2–7 ngày, đau sau hốc mắt, đau cơ, có thể xuất huyết. Có thể diễn tiến nặng ở ngày 3–6.',
      weights: { sot: 4, dau_sau_mat: 5, dau_co: 3, xuat_huyet: 5, phat_ban: 3, dau_dau: 3, buon_non: 2, met_moi: 2 },
      drugs: ['ha_sot', 'bu_nuoc'],
      advice: ['Chỉ dùng Paracetamol hạ sốt; KHÔNG dùng Aspirin/Ibuprofen/NSAID.', 'Nên đi xét nghiệm (công thức máu, NS1) sớm và theo dõi tại cơ sở y tế.', 'Đến cấp cứu nếu đau bụng, nôn nhiều, chảy máu, lừ đừ, tay chân lạnh.'],
      facility: ['hospital', 'clinic'],
      avoid: ['nsaid'],
    },
    {
      id: 'viem_da_day', name: 'Viêm / loét dạ dày', specialty: 'Tiêu hóa',
      summary: 'Đau/nóng rát vùng thượng vị, đầy hơi, buồn nôn, thường liên quan bữa ăn, vi khuẩn H. pylori, thuốc NSAID.',
      weights: { dau_bung_tren: 5, day_bung: 3, buon_non: 3, o_chua: 3, non: 2 },
      drugs: ['khang_acid', 'chong_non'],
      advice: ['Ăn chia nhỏ bữa, tránh rượu bia, cà phê, đồ cay; không dùng NSAID.', 'Đi khám nội soi/xét nghiệm H. pylori nếu đau tái diễn, sụt cân, đi ngoài phân đen.'],
      facility: ['clinic', 'hospital', 'pharmacy'],
      avoid: ['nsaid'],
    },
    {
      id: 'trao_nguoc', name: 'Trào ngược dạ dày – thực quản (GERD)', specialty: 'Tiêu hóa',
      summary: 'Ợ nóng, ợ chua, nóng rát sau xương ức, nặng hơn khi nằm hoặc sau ăn no.',
      weights: { o_chua: 5, dau_bung_tren: 3, day_bung: 2, ho_khan: 1, buon_non: 1 },
      drugs: ['khang_acid'],
      advice: ['Không nằm ngay sau ăn, kê cao đầu giường, giảm cân nếu thừa cân.', 'Đau ngực lan tay/hàm cần loại trừ bệnh tim, đi cấp cứu.'],
      facility: ['clinic', 'pharmacy'],
    },
    {
      id: 'tieu_chay', name: 'Viêm dạ dày – ruột cấp / ngộ độc thực phẩm', specialty: 'Tiêu hóa / Nội tổng quát',
      summary: 'Tiêu chảy, nôn, đau quặn bụng sau ăn uống không đảm bảo vệ sinh; nguy cơ mất nước.',
      weights: { tieu_chay: 5, non: 4, dau_bung_quanh_ron: 4, buon_non: 3, sot: 2, met_moi: 1 },
      drugs: ['bu_nuoc', 'men_vi_sinh', 'chong_non'],
      advice: ['Ưu tiên bù nước (Oresol), ăn nhẹ dễ tiêu.', 'Đi khám nếu tiêu chảy >2 ngày, phân có máu/nhầy, sốt cao, hoặc có dấu hiệu mất nước.'],
      facility: ['clinic', 'hospital', 'pharmacy'],
    },
    {
      id: 'nhiem_trung_tiet_nieu', name: 'Nhiễm trùng đường tiết niệu', specialty: 'Tiết niệu / Nội tổng quát',
      summary: 'Tiểu buốt, tiểu nhiều lần, đau bụng dưới; cần xét nghiệm nước tiểu và thường dùng kháng sinh theo đơn.',
      weights: { tieu_buot: 5, tieu_nhieu: 4, dau_bung_duoi: 3, sot: 1, met_moi: 1 },
      drugs: ['khang_sinh', 'ha_sot'],
      advice: ['Uống nhiều nước.', 'Nên đi khám trong 24–48 giờ; sốt, đau lưng, tiểu máu có thể là nhiễm trùng thận.'],
      facility: ['clinic', 'hospital'],
    },
    {
      id: 'dau_nua_dau', name: 'Đau nửa đầu (Migraine)', specialty: 'Thần kinh',
      summary: 'Đau đầu một bên, theo nhịp mạch, kèm buồn nôn, sợ ánh sáng/tiếng ồn.',
      weights: { dau_nua_dau: 5, nhay_cam_anh_sang: 4, buon_non: 3, dau_dau: 3, non: 2, chong_mat: 1 },
      drugs: ['thuoc_dau_nua'],
      advice: ['Nghỉ ở phòng tối, yên tĩnh; ghi nhật ký tác nhân (thiếu ngủ, stress, thực phẩm).', 'Khám thần kinh nếu cơn thường xuyên hoặc kiểu đau đầu thay đổi.'],
      facility: ['clinic', 'hospital'],
    },
    {
      id: 'dau_dau_cang_thang', name: 'Đau đầu căng thẳng', specialty: 'Nội tổng quát / Thần kinh',
      summary: 'Đau âm ỉ hai bên như bị đè/siết quanh đầu, liên quan stress, thiếu ngủ.',
      weights: { dau_dau: 5, met_moi: 2, dau_co: 1 },
      drugs: ['ha_sot', 'nsaid'],
      advice: ['Ngủ đủ, giảm căng thẳng, thư giãn cổ vai.', 'Khám nếu đau đầu mới xuất hiện sau 50 tuổi hoặc kèm yếu liệt/nhìn mờ.'],
      facility: ['pharmacy', 'clinic'],
    },
    {
      id: 'viem_ket_mac', name: 'Viêm kết mạc (đau mắt đỏ)', specialty: 'Nhãn khoa',
      summary: 'Mắt đỏ, ngứa/cộm, chảy ghèn hoặc nước mắt; dễ lây nếu do virus/vi khuẩn.',
      weights: { do_mat: 5, ghen_mat: 4, ngua_mat: 3, sot: 1 },
      drugs: ['thuoc_mat'],
      advice: ['Rửa tay thường xuyên, không dùng chung khăn, không dụi mắt.', 'Đi khám mắt nếu giảm thị lực, đau mắt nhiều hoặc sợ ánh sáng.'],
      facility: ['clinic', 'hospital', 'pharmacy'],
    },
  ];

  const api = { SYMPTOMS, RED_FLAGS, DRUGS, CONDITIONS };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Knowledge = api;
})(typeof window !== 'undefined' ? window : globalThis);
