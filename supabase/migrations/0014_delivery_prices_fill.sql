-- Auto Style — Fill real delivery prices per wilaya from the courier's rate
-- sheet (ZR Express), home delivery + office/stop-desk pickup. The "retour"
-- (return) column from the sheet is intentionally not used anywhere here.
-- Wilayas not on the courier's sheet (58 - AIN DEFLA's office price was
-- illegible in the source photo, and wilayas 59-69 are newer subdivisions
-- the sheet predates) are set to 0 so they read as "not priced yet" in the
-- admin dashboard rather than keeping the placeholder 400 default.

UPDATE delivery_prices SET home_price = 1400, office_price = 970  WHERE wilaya = '01 - Adrar';
UPDATE delivery_prices SET home_price = 850,  office_price = 520  WHERE wilaya = '02 - Chlef';
UPDATE delivery_prices SET home_price = 950,  office_price = 620  WHERE wilaya = '03 - Laghouat';
UPDATE delivery_prices SET home_price = 850,  office_price = 520  WHERE wilaya = '04 - Oum El Bouaghi';
UPDATE delivery_prices SET home_price = 900,  office_price = 520  WHERE wilaya = '05 - Batna';
UPDATE delivery_prices SET home_price = 800,  office_price = 520  WHERE wilaya = '06 - Béjaïa';
UPDATE delivery_prices SET home_price = 950,  office_price = 620  WHERE wilaya = '07 - Biskra';
UPDATE delivery_prices SET home_price = 1100, office_price = 720  WHERE wilaya = '08 - Béchar';
UPDATE delivery_prices SET home_price = 600,  office_price = 470  WHERE wilaya = '09 - Blida';
UPDATE delivery_prices SET home_price = 700,  office_price = 520  WHERE wilaya = '10 - Bouira';
UPDATE delivery_prices SET home_price = 1600, office_price = 1120 WHERE wilaya = '11 - Tamanrasset';
UPDATE delivery_prices SET home_price = 900,  office_price = 570  WHERE wilaya = '12 - Tébessa';
UPDATE delivery_prices SET home_price = 900,  office_price = 570  WHERE wilaya = '13 - Tlemcen';
UPDATE delivery_prices SET home_price = 850,  office_price = 520  WHERE wilaya = '14 - Tiaret';
UPDATE delivery_prices SET home_price = 750,  office_price = 520  WHERE wilaya = '15 - Tizi Ouzou';
UPDATE delivery_prices SET home_price = 500,  office_price = 370  WHERE wilaya = '16 - Alger';
UPDATE delivery_prices SET home_price = 950,  office_price = 570  WHERE wilaya = '17 - Djelfa';
UPDATE delivery_prices SET home_price = 900,  office_price = 520  WHERE wilaya = '18 - Jijel';
UPDATE delivery_prices SET home_price = 900,  office_price = 520  WHERE wilaya = '19 - Sétif';
UPDATE delivery_prices SET home_price = 900,  office_price = 570  WHERE wilaya = '20 - Saïda';
UPDATE delivery_prices SET home_price = 900,  office_price = 520  WHERE wilaya = '21 - Skikda';
UPDATE delivery_prices SET home_price = 900,  office_price = 520  WHERE wilaya = '22 - Sidi Bel Abbès';
UPDATE delivery_prices SET home_price = 850,  office_price = 520  WHERE wilaya = '23 - Annaba';
UPDATE delivery_prices SET home_price = 900,  office_price = 520  WHERE wilaya = '24 - Guelma';
UPDATE delivery_prices SET home_price = 800,  office_price = 520  WHERE wilaya = '25 - Constantine';
UPDATE delivery_prices SET home_price = 800,  office_price = 520  WHERE wilaya = '26 - Médéa';
UPDATE delivery_prices SET home_price = 900,  office_price = 570  WHERE wilaya = '27 - Mostaganem';
UPDATE delivery_prices SET home_price = 850,  office_price = 520  WHERE wilaya = '28 - M''Sila';
UPDATE delivery_prices SET home_price = 900,  office_price = 570  WHERE wilaya = '29 - Mascara';
UPDATE delivery_prices SET home_price = 950,  office_price = 670  WHERE wilaya = '30 - Ouargla';
UPDATE delivery_prices SET home_price = 800,  office_price = 520  WHERE wilaya = '31 - Oran';
UPDATE delivery_prices SET home_price = 1100, office_price = 670  WHERE wilaya = '32 - El Bayadh';
UPDATE delivery_prices SET home_price = 0,    office_price = 0    WHERE wilaya = '33 - Illizi';
UPDATE delivery_prices SET home_price = 800,  office_price = 520  WHERE wilaya = '34 - Bordj Bou Arréridj';
UPDATE delivery_prices SET home_price = 700,  office_price = 520  WHERE wilaya = '35 - Boumerdès';
UPDATE delivery_prices SET home_price = 850,  office_price = 520  WHERE wilaya = '36 - El Tarf';
UPDATE delivery_prices SET home_price = 0,    office_price = 0    WHERE wilaya = '37 - Tindouf';
UPDATE delivery_prices SET home_price = 900,  office_price = 520  WHERE wilaya = '38 - Tissemsilt';
UPDATE delivery_prices SET home_price = 950,  office_price = 670  WHERE wilaya = '39 - El Oued';
UPDATE delivery_prices SET home_price = 900,  office_price = 520  WHERE wilaya = '40 - Khenchela';
UPDATE delivery_prices SET home_price = 700,  office_price = 520  WHERE wilaya = '41 - Souk Ahras';
UPDATE delivery_prices SET home_price = 900,  office_price = 520  WHERE wilaya = '42 - Tipaza';
UPDATE delivery_prices SET home_price = 900,  office_price = 520  WHERE wilaya = '43 - Mila';
UPDATE delivery_prices SET home_price = 0,    office_price = 0    WHERE wilaya = '44 - Aïn Defla';
UPDATE delivery_prices SET home_price = 1100, office_price = 670  WHERE wilaya = '45 - Naâma';
UPDATE delivery_prices SET home_price = 900,  office_price = 520  WHERE wilaya = '46 - Aïn Témouchent';
UPDATE delivery_prices SET home_price = 950,  office_price = 620  WHERE wilaya = '47 - Ghardaïa';
UPDATE delivery_prices SET home_price = 900,  office_price = 520  WHERE wilaya = '48 - Relizane';
UPDATE delivery_prices SET home_price = 1400, office_price = 970  WHERE wilaya = '49 - Timimoun';
UPDATE delivery_prices SET home_price = 0,    office_price = 0    WHERE wilaya = '50 - Bordj Badji Mokhtar';
UPDATE delivery_prices SET home_price = 950,  office_price = 620  WHERE wilaya = '51 - Ouled Djellal';
UPDATE delivery_prices SET home_price = 1100, office_price = 970  WHERE wilaya = '52 - Béni Abbès';
UPDATE delivery_prices SET home_price = 1600, office_price = 0    WHERE wilaya = '53 - In Salah';
UPDATE delivery_prices SET home_price = 1600, office_price = 670  WHERE wilaya = '54 - In Guezzam';
UPDATE delivery_prices SET home_price = 950,  office_price = 0    WHERE wilaya = '55 - Touggourt';
UPDATE delivery_prices SET home_price = 0,    office_price = 0    WHERE wilaya = '56 - Djanet';
UPDATE delivery_prices SET home_price = 950,  office_price = 0    WHERE wilaya = '57 - El M''Ghair';
UPDATE delivery_prices SET home_price = 1000, office_price = 0    WHERE wilaya = '58 - El Meniaa';

-- Not on the courier's sheet — zero out until priced
UPDATE delivery_prices SET home_price = 0, office_price = 0 WHERE wilaya = '59 - Aflou';
UPDATE delivery_prices SET home_price = 0, office_price = 0 WHERE wilaya = '60 - El Abiodh Sidi Cheikh';
UPDATE delivery_prices SET home_price = 0, office_price = 0 WHERE wilaya = '61 - El Aricha';
UPDATE delivery_prices SET home_price = 0, office_price = 0 WHERE wilaya = '62 - El Kantara';
UPDATE delivery_prices SET home_price = 0, office_price = 0 WHERE wilaya = '63 - Barika';
UPDATE delivery_prices SET home_price = 0, office_price = 0 WHERE wilaya = '64 - Boussaâda';
UPDATE delivery_prices SET home_price = 0, office_price = 0 WHERE wilaya = '65 - Bir El Ater';
UPDATE delivery_prices SET home_price = 0, office_price = 0 WHERE wilaya = '66 - Ksar El Boukhari';
UPDATE delivery_prices SET home_price = 0, office_price = 0 WHERE wilaya = '67 - Ksar Chellala';
UPDATE delivery_prices SET home_price = 0, office_price = 0 WHERE wilaya = '68 - Aïn Oussara';
UPDATE delivery_prices SET home_price = 0, office_price = 0 WHERE wilaya = '69 - Messaad';
