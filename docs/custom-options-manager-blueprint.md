# Custom Options Manager Blueprint

## 1) Muc tieu

Xay dung man quan tri Custom Options doc lap trong admin.
Man nay khong phu thuoc truc tiep vao Product va chua goi API that.
Muc tieu la mo phong duoc day du:

- Cau truc Group -> Option -> Choice -> Condition.
- Rule hien/an option theo lua chon cua option khac.
- Tinh phu phi theo lua chon custom.
- Kien truc de doi tu fake data sang API ma khong dap lai UI.

## 2) Mapping nghiep vu

- Product Option (variant): phan phan loai SKU, da ton tai.
- Custom Option Module: phan tuy chinh bo sung (co the cong phi), gan cho nhieu san pham.

Entity mapping:

- Group: bo custom hoan chinh, vi du "Shaft Setup".
- Option: 1 dong cau hinh, vi du "Shaft Flex", "Hang Shaft".
- Choice: gia tri cua option, vi du "Regular", "Stiff".
- Condition: luat show/hide option dua tren trigger option + trigger choice.

## 3) Pham vi phase nay

Trong pham vi:

- CRUD local cho Group.
- CRUD local cho Option.
- CRUD local cho Choice.
- CRUD local cho Condition.
- Preview runtime va tinh phu phi.

Ngoai pham vi:

- Chua gan Group vao Product.
- Chua call API custom-options.
- Chua ghi du lieu sang cart/order.

## 4) Kien truc de xay dung

Route:

- /admin/products/custom-options

Thanh phan:

- Left panel: danh sach Group + tao/sua/xoa.
- Center panel: Option/Choice builder trong Group dang chon.
- Right panel: Condition builder + Preview runtime.

State management:

- Dung local state cho phase 1.
- Tach model va helper tinh toan (condition engine, pricing engine).
- Data source theo repository pattern:
  - Mock repository (phase hien tai).
  - API repository (phase tiep theo).

## 5) Data model de FE su dung

Group:

- id: string
- name: string
- sortOrder: number
- options: CustomOption[]
- conditions: CustomCondition[]

Option:

- id: string
- label: string
- type: TEXT | TEXTAREA | NUMBER | DROPDOWN | RADIO | CHECKBOX | COLOR_SWATCH | IMAGE_SWATCH | FILE_UPLOAD | DATE
- placeholder?: string
- isRequired?: boolean
- sortOrder: number
- priceModifierType: NONE | FIXED | PERCENT
- priceModifierValue?: number
- choices: CustomChoice[]

Choice:

- id: string
- label: string
- value: string
- priceModifierType: NONE | FIXED | PERCENT
- priceModifierValue?: number
- sortOrder: number

Condition:

- id: string
- targetOptionId: string
- triggerOptionId: string
- triggerChoiceId: string
- action: SHOW | HIDE

## 6) Rule engine

### 6.1 Visibility

Input:

- options
- conditions
- current selections

Rule:

- Option co SHOW condition: mac dinh an.
- Option khong co SHOW condition: mac dinh hien.
- Neu trigger match SHOW -> hien.
- Neu trigger match HIDE -> an.
- Khi SHOW va HIDE cung match, HIDE uu tien cao hon.

Output:

- visibleMap theo optionId.

### 6.2 Pricing

Input:

- basePrice (preview)
- selections
- option/choice modifiers

Rule:

- FIXED: cong truc tiep vao tong phu phi.
- PERCENT: cong theo basePrice \* percent / 100.
- NONE: 0.
- Option modifier tinh khi option co gia tri hop le.
- Choice modifier tinh theo choice dang chon.

Output:

- surchargeTotal
- finalPrice = basePrice + surchargeTotal

## 7) UX chi tiet

Left panel:

- Search Group.
- Button "Tao Group".
- Click item de chon Group.

Center panel (Option builder):

- Inline edit ten group.
- Add Option.
- Moi Option cho sua:
  - label
  - type
  - required
  - sortOrder
  - price modifier
  - placeholder (neu can)
- Neu option type la lua chon (dropdown/radio/checkbox), hien block Choice:
  - add/edit/remove choice
  - sortOrder choice
  - price modifier choice

Right panel:

- Condition list:
  - trigger option
  - trigger choice
  - action
  - target option
  - add/remove
- Preview:
  - render form runtime theo visibleMap
  - cho phep chon thu
  - hien tong phu phi va gia cuoi

## 8) Fake data scenario

Seed 1 group "Shaft Setup" voi options:

- Shaft Flex (RADIO): Regular, Stiff, X-Stiff
- Shaft Brand (Regular) (DROPDOWN)
- Shaft Brand (Stiff) (DROPDOWN)
- Shaft Model (Regular) (DROPDOWN)
- Shaft Model (Stiff) (DROPDOWN)
- Length Adjustment (DROPDOWN)

Condition:

- Neu Flex = Regular -> SHOW Brand(Regular), Model(Regular), HIDE Brand(Stiff), Model(Stiff)
- Neu Flex = Stiff hoac X-Stiff -> SHOW Brand(Stiff), Model(Stiff), HIDE Brand(Regular), Model(Regular)

## 9) Chien luoc doi sang API (phase tiep)

- Tao customOptionsRepository interface:
  - listGroups
  - getGroup
  - createGroup
  - updateGroup
  - deleteGroup
  - createOption/updateOption/deleteOption
  - createChoice/updateChoice/deleteChoice
  - createCondition/deleteCondition
- Mock implementation da su dung san.
- Khi doi API, chi thay implementation, UI va engine giu nguyen.

## 10) Tieu chi hoan thanh phase nay

- Truy cap duoc route /admin/products/custom-options.
- Tao/sua/xoa duoc Group/Option/Choice/Condition tren local state.
- Preview thay doi theo condition.
- Tong phu phi cap nhat theo lua chon.
- Khong phat sinh loi TypeScript.
