# Denný pocit v DIVA COMMUNITY

## Čo pribudne
- Do horného aj spodného menu pribudne položka **Ako sa dnes cítim?** s jemnou ikonou srdca.
- Otvorí samostatnú stránku v rámci komunity.
- Členka si vyberie jeden z piatich pocitov, môže dopísať krátku súkromnú poznámku a záznam uložiť.
- V ten istý deň môže svoj výber aj poznámku upraviť.
- Na stránke uvidí aj stručný prehľad svojich posledných pocitov.

## Súkromie a bezpečnosť
- Denné pocity budú súkromné: každá členka uvidí a upraví iba vlastné záznamy.
- Jeden účet bude mať najviac jeden záznam za deň.
- Údaje nebudú zobrazené vo verejnom feede ani na profile.

## Technické detaily
- Pridá sa chránené úložisko denných záznamov s pravidlami prístupu iba pre prihlásenú členku.
- Pridá sa nová cesta `/community/pocit`, načítanie dnešného záznamu a bezpečné uloženie alebo aktualizácia.
- Menu zostane použiteľné na mobile: dlhší názov sa zobrazí stručne ako **Pocit**, plný názov bude na veľkej obrazovke.
- Po dokončení sa overí uloženie, úprava, mobilné zobrazenie a stav aplikácie bez chýb.
