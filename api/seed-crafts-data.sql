--
-- PostgreSQL database dump
--

\restrict 4A5xAcgycUf5HTVjnAvTwvqrlEOdurwQeUcBh2S9Qsr3etlGeLiLWHqxOtEAPHs

-- Dumped from database version 16.13 (Homebrew)
-- Dumped by pg_dump version 16.13 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: Crafts; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."Crafts" ("CraftId", "ProductName", "Address", "Prefecture", "Latitude", "Longitude", "Image", "Description", "CreateAt", "Category", "Certification", "Features", "ProductionAreas", "Reading") VALUES ('68bb94d9-6052-44f2-a583-7fab7b8ebeb6', '美濃焼', '多治見市', '岐阜県', 35.33299621619973, 137.13194578886032, 'https://colbase.nich.go.jp/media/tnm/G-5313/image/slideshow_s/G-5313_C0084322.jpg', '岐阜県東濃地方(多治見市・土岐市・瑞浪市など)で作られる日本を代表する陶磁器。志野・織部・黄瀬戸など多彩な様式があり、桃山時代から400年以上続く伝統を持つ。国内の陶磁器生産量の約半分を占める一大産地。', '2026-08-20 19:00:51.801579+09', '陶磁器', '経済産業大臣指定伝統的工芸品', '{種類や表現が豊富,暮らしに身近なやきもの,伝統と新しい表現が共存,東濃地方を代表する産業}', '{多治見市,土岐市,瑞浪市}', 'みのやき');
INSERT INTO public."Crafts" ("CraftId", "ProductName", "Address", "Prefecture", "Latitude", "Longitude", "Image", "Description", "CreateAt", "Category", "Certification", "Features", "ProductionAreas", "Reading") VALUES ('903b9fa0-afd2-45b1-95b5-777c1f5f1ecf', '有田焼', '有田町', '佐賀県', 33.19230110701913, 129.86696105450392, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/1934.98_-_Arita_Ware_Kakiemon_Floral-shaped_Bowl.jpg/960px-1934.98_-_Arita_Ware_Kakiemon_Floral-shaped_Bowl.jpg', '佐賀県有田町を中心に作られる日本初の磁器。白磁に染付や色絵で絵付けをした美しい器で、17世紀初頭から400年以上の歴史を持つ。ヨーロッパにも輸出され世界的に高く評価されてきた。', '2026-08-20 23:04:36.806129+09', '陶磁器', '経済産業大臣指定伝統的工芸品', '{日本初の磁器,白磁に映える繊細な絵付け,海外にも輸出された歴史,400年続く焼き物の産地}', '{有田町,伊万里市}', 'ありたやき');
INSERT INTO public."Crafts" ("CraftId", "ProductName", "Address", "Prefecture", "Latitude", "Longitude", "Image", "Description", "CreateAt", "Category", "Certification", "Features", "ProductionAreas", "Reading") VALUES ('06052b9a-0371-43da-8027-680d2fc174d4', '南部鉄器', '盛岡市', '岩手県', 39.655938249465855, 141.167696043849, 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Nambu_Tetsubin.jpg/960px-Nambu_Tetsubin.jpg', '岩手県盛岡市・奥州市を中心に作られる伝統的な鋳物。代表的な鉄瓶は肌触りの良い「肌」と呼ばれる細かな凹凸模様が特徴で、鉄分補給ができる道具としても人気が高い。400年以上の歴史を持つ。', '2026-08-20 23:04:37.178534+09', '鋳物', '経済産業大臣指定伝統的工芸品', '{熱を均一に伝える鋳物の技,使うほどに味わいが増す,鉄瓶や急須が代表的な製品,400年の歴史を持つ鋳物産業}', '{盛岡市,奥州市}', 'なんぶてっき');
INSERT INTO public."Crafts" ("CraftId", "ProductName", "Address", "Prefecture", "Latitude", "Longitude", "Image", "Description", "CreateAt", "Category", "Certification", "Features", "ProductionAreas", "Reading") VALUES ('625e453a-4016-40b7-97a3-573afebd7b3a', '博多織', '福岡市', '福岡県', 33.432383427958065, 130.39481576532125, 'https://upload.wikimedia.org/wikipedia/commons/4/43/Hakata_obi.JPG', '福岡県福岡市に伝わる絹織物。縦糸を密にして横糸を織り込む「経(たて)糸を浮かせる」独特の技法により、厚みとハリのある丈夫な生地に仕上がる。帯地として特に有名で、約770年の歴史を持つ。', '2026-08-20 23:04:37.715309+09', '織物', '経済産業大臣指定伝統的工芸品', '{厚みと張りのある独特の風合い,献上柄と呼ばれる伝統模様,帯地として特に有名,770年以上の歴史}', '{福岡市}', 'はかたおり');
INSERT INTO public."Crafts" ("CraftId", "ProductName", "Address", "Prefecture", "Latitude", "Longitude", "Image", "Description", "CreateAt", "Category", "Certification", "Features", "ProductionAreas", "Reading") VALUES ('7cfec6e7-7b44-44c4-8021-5c1b83c34a8a', '江戸切子', '江戸川区', '東京都', 35.70663196262769, 139.86867673695087, 'https://upload.wikimedia.org/wikipedia/commons/3/35/Edo-Kiriko.JPG', '東京都で発展したカットグラス工芸。ガラスの表面に細かい切子模様をカットして施す技法で、光を受けてきらめく繊細な文様が特徴。江戸時代末期に始まり、現在も職人による手作業で作られている。', '2026-08-20 23:04:38.23088+09', 'ガラス', '経済産業大臣指定伝統的工芸品', '{ガラス表面に施すカット模様,光を受けて輝く繊細な文様,江戸時代から続くガラス工芸,職人による手作業の切子細工}', '{江戸川区,墨田区}', 'えどきりこ');
INSERT INTO public."Crafts" ("CraftId", "ProductName", "Address", "Prefecture", "Latitude", "Longitude", "Image", "Description", "CreateAt", "Category", "Certification", "Features", "ProductionAreas", "Reading") VALUES ('6753c1c3-4034-4a70-a87e-dd658a2a8ccf', '会津塗', '会津若松市', '福島県', 37.4947487897733, 139.92974426597357, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Craft_x_Tech_Tohoku_Project_%282024%29.jpg/960px-Craft_x_Tech_Tohoku_Project_%282024%29.jpg', '福島県会津地方に伝わる伝統漆器。丈夫な下地作りと、金や銀の粉で絵柄を描く蒔絵などの加飾技法が特徴。安土桃山時代から続き、日用品から工芸品まで幅広く作られている。', '2026-08-20 23:04:38.768927+09', '漆器', '経済産業大臣指定伝統的工芸品', '{金虫喰塗など独特の加飾技法,堅牢で美しい木製漆器,会津地方に根付く400年の歴史,日用品から美術品まで幅広い製品}', '{会津若松市,喜多方市}', 'あいづぬり');
INSERT INTO public."Crafts" ("CraftId", "ProductName", "Address", "Prefecture", "Latitude", "Longitude", "Image", "Description", "CreateAt", "Category", "Certification", "Features", "ProductionAreas", "Reading") VALUES ('503fd87f-d130-41a4-9c85-52c397ccb0e2', '岐阜和傘', '岐阜市', '岐阜県', 35.413353540999154, 136.7591244354844, 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Gifu_Umbrella_ac_%281%29.jpg/960px-Gifu_Umbrella_ac_%281%29.jpg', '岐阜市で江戸時代から続く伝統的な和傘。竹の骨組みに和紙を貼り、油や渋柿から作る渋を塗って仕上げる。全国有数の和傘の産地として知られ、繊細な骨組みと美しい模様が特徴。', '2026-08-20 19:28:02.343625+09', '和傘', '岐阜県郷土工芸品', '{細い竹骨と和紙で作られる伝統的な傘,軽くて丈夫な作り,分業制による職人技の結晶,現在は装飾用としても人気}', '{岐阜市,山県市}', 'ぎふわがさ');
INSERT INTO public."Crafts" ("CraftId", "ProductName", "Address", "Prefecture", "Latitude", "Longitude", "Image", "Description", "CreateAt", "Category", "Certification", "Features", "ProductionAreas", "Reading") VALUES ('6b9f2c3e-9224-4bf2-a99e-9bb5c94b38e3', '輪島塗', '輪島市', '石川県', 37.41048325437375, 136.9728059694171, 'https://ibmuseum.mapps.ne.jp/files/8818/media_files/mid/1441.jpg', '石川県輪島市に伝わる日本を代表する漆器。木地に何度も漆を塗り重ね、布を貼って補強する「布着せ」など堅牢な下地作りが特徴。沈金・蒔絵といった加飾技法でも知られ、完成まで100以上の工程を要する。', '2026-08-20 23:04:35.098976+09', '漆器', '国指定伝統的工芸品', '{100以上の工程を経る堅牢な漆器,布着せによる高い耐久性,沈金・蒔絵などの加飾技法,400年以上続く歴史ある産業}', '{輪島市}', 'わじまぬり');
INSERT INTO public."Crafts" ("CraftId", "ProductName", "Address", "Prefecture", "Latitude", "Longitude", "Image", "Description", "CreateAt", "Category", "Certification", "Features", "ProductionAreas", "Reading") VALUES ('aec74c5d-6cf0-4b56-822d-87f2600f130c', '丸亀うちわ', '丸亀市', '香川県', 34.28881291811076, 133.79824195057154, 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Uchiwa_Museum01.jpg/960px-Uchiwa_Museum01.jpg', '香川県丸亀市で作られるうちわ。国内生産の大部分を占める一大産地で、細く割った竹を骨に使う「平柄」の製法が特徴。江戸時代に金比羅参りの土産として広まったのが始まりとされる。', '2026-08-20 23:04:39.153094+09', 'うちわ', '経済産業大臣指定伝統的工芸品', '{国内生産の大部分を占める産地,1本の竹から作る柄と骨,丸柄・平柄など多様な形,江戸時代から続くうちわ作り}', '{丸亀市}', 'まるがめうちわ');
INSERT INTO public."Crafts" ("CraftId", "ProductName", "Address", "Prefecture", "Latitude", "Longitude", "Image", "Description", "CreateAt", "Category", "Certification", "Features", "ProductionAreas", "Reading") VALUES ('c6263ba5-0274-42d8-be2f-d216835ddc2a', '京友禅', '京都市', '京都府', 35.003883998186126, 135.76192511245608, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/%E5%8D%97%E9%80%B2%E4%B8%80%E9%83%8E%E6%B0%8F%E3%81%AE%E9%81%8E%E5%8E%BB%E3%81%AE%E5%8F%97%E8%B3%9E%E4%BD%9C%E5%93%81%E3%81%A7%E3%80%81%E5%8F%8B%E7%A6%85%E6%9F%93%E3%82%81%E3%81%A7%E3%81%AE%E7%9D%80%E7%89%A9%E4%BD%9C%E5%93%81%EF%BC%93.jpg/960px-%E5%8D%97%E9%80%B2%E4%B8%80%E9%83%8E%E6%B0%8F%E3%81%AE%E9%81%8E%E5%8E%BB%E3%81%AE%E5%8F%97%E8%B3%9E%E4%BD%9C%E5%93%81%E3%81%A7%E3%80%81%E5%8F%8B%E7%A6%85%E6%9F%93%E3%82%81%E3%81%A7%E3%81%AE%E7%9D%80%E7%89%A9%E4%BD%9C%E5%93%81%EF%BC%93.jpg', '京都で発展した友禅染の一種。糊で防染しながら多彩な色で模様を描く技法で、華やかで繊細な絵柄が特徴。手描き・型染めなど複数の技法があり、着物や帯として広く親しまれている。', '2026-08-20 23:04:36.176002+09', '染物', '経済産業大臣指定伝統的工芸品', '{多彩な色使いによる華やかな柄,手描き・型染めなど多様な技法,京都の着物文化を支える染色技術,300年以上の歴史}', '{京都市}', 'きょうゆうぜん');


--
-- PostgreSQL database dump complete
--

\unrestrict 4A5xAcgycUf5HTVjnAvTwvqrlEOdurwQeUcBh2S9Qsr3etlGeLiLWHqxOtEAPHs

