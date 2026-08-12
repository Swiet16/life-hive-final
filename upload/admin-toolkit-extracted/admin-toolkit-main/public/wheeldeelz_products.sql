-- ============================================================
-- WheelDeelz Full Product Catalog SQL
-- 120+ products across all categories
-- Safe to run multiple times — WHERE NOT EXISTS prevents duplicates
-- Run in Supabase → SQL Editor
-- ============================================================

-- ── HERO SLIDES (4-6 slides) ────────────────────────────────

INSERT INTO hero_images (title, headline, subheadline, cta_label, cta_href, image_url, active, sort_order)
SELECT 'Performance Summer', 'Built for Speed. Tuned for Grip.', 'Shop our summer performance collection — Michelin, Pirelli, Yokohama in stock now.', 'Shop Summer Tires', '/shop', 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1920&q=80', true, 1
WHERE NOT EXISTS (SELECT 1 FROM hero_images WHERE title = 'Performance Summer');

INSERT INTO hero_images (title, headline, subheadline, cta_label, cta_href, image_url, active, sort_order)
SELECT 'Winter Ready', 'Conquer Every Road. Every Season.', 'Premium all-season and winter tires shipped from USA and Canada warehouses. Free tracking.', 'Shop Winter Tires', '/shop', 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1920&q=80', true, 2
WHERE NOT EXISTS (SELECT 1 FROM hero_images WHERE title = 'Winter Ready');

INSERT INTO hero_images (title, headline, subheadline, cta_label, cta_href, image_url, active, sort_order)
SELECT 'Premium Wheels', 'Upgrade Your Ride. Elevate Your Style.', 'Forged and cast alloy wheels from BBS, Vossen, HRE and more. 20+ brands available.', 'Shop Wheels', '/wheels', 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1920&q=80', true, 3
WHERE NOT EXISTS (SELECT 1 FROM hero_images WHERE title = 'Premium Wheels');

INSERT INTO hero_images (title, headline, subheadline, cta_label, cta_href, image_url, active, sort_order)
SELECT 'Track Day', 'Zero Compromise. Maximum Performance.', 'Race-grade tires and components for the track and the street. Engineered to win.', 'View Deals', '/deals', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1920&q=80', true, 4
WHERE NOT EXISTS (SELECT 1 FROM hero_images WHERE title = 'Track Day');

INSERT INTO hero_images (title, headline, subheadline, cta_label, cta_href, image_url, active, sort_order)
SELECT 'Off-Road Beast', 'Go Anywhere. Fear Nothing.', 'Heavy-duty lift kits, all-terrain tires and off-road accessories for trucks and SUVs.', 'Shop Off-Road', '/shop', 'https://images.unsplash.com/photo-1606577924006-27d39b132ae2?auto=format&fit=crop&w=1920&q=80', true, 5
WHERE NOT EXISTS (SELECT 1 FROM hero_images WHERE title = 'Off-Road Beast');

-- ── TIRES (42 products — all with 20% discount) ─────────────

-- Michelin (6)
INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Michelin','Pilot Sport 4S','245/40R18 97Y','tires',239.99,299.99,true,10,'SUMMER','in',true,10,'Ultra-high performance summer tire with exceptional wet grip','The Michelin Pilot Sport 4S delivers outstanding grip on both dry and wet roads. Engineered for sports cars with bi-compound technology.','[]','{"Season":"Summer","Speed Rating":"Y","Load Index":"97","Rim":"18\""}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Michelin' AND name='Pilot Sport 4S' AND spec='245/40R18 97Y');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Michelin','Pilot Sport 5','225/45R17 94Y','tires',199.99,249.99,true,8,'SUMMER','in',true,11,'Next-gen summer performance tire','Pilot Sport 5 features the latest Michelin compound technology for ultimate cornering and braking.','[]','{"Season":"Summer","Speed Rating":"Y","Load Index":"94","Rim":"17\""}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Michelin' AND name='Pilot Sport 5' AND spec='225/45R17 94Y');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Michelin','CrossClimate 2','215/55R17 98W','tires',175.99,219.99,true,7,'ALL-SEASON','in',false,12,'Year-round versatility with summer performance','The CrossClimate 2 delivers summer-level performance while being 3-peak mountain snowflake rated.','[]','{"Season":"All-Season","Speed Rating":"W","Load Index":"98","Rim":"17\""}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Michelin' AND name='CrossClimate 2' AND spec='215/55R17 98W');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Michelin','Defender T+H','205/65R16 95H','tires',139.99,174.99,true,6,'ALL-SEASON','in',false,13,'Long-lasting all-season reliability','80,000-mile warranty tire with EverTread compound for extended tread life.','[]','{"Season":"All-Season","Speed Rating":"H","Load Index":"95","Rim":"16\""}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Michelin' AND name='Defender T+H' AND spec='205/65R16 95H');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Michelin','X-Ice Snow','225/50R18 99H','tires',189.99,237.49,true,8,'WINTER','in',true,14,'Premium winter tire for severe snow conditions','3-peak mountain snowflake certified. V-Formation tread pattern for superior snow and ice grip.','[]','{"Season":"Winter","Speed Rating":"H","Load Index":"99","Rim":"18\""}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Michelin' AND name='X-Ice Snow' AND spec='225/50R18 99H');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Michelin','LTX M/S2','265/70R17 121S','tires',209.99,262.49,true,9,'ALL-TERRAIN','low',false,15,'Light truck all-season tire','Designed for pickups and SUVs. Excellent on-road comfort with off-road capability.','[]','{"Season":"All-Season","Speed Rating":"S","Load Index":"121","Rim":"17\""}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Michelin' AND name='LTX M/S2' AND spec='265/70R17 121S');

-- Pirelli (6)
INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Pirelli','P Zero','295/30R20 101Y','tires',399.99,499.99,true,17,'TRACK','in',true,20,'OEM fitment for exotic supercars','P Zero is the tire of champions — factory-fit on Ferrari, Lamborghini, BMW M. Asymmetric compound.','[]','{"Season":"Summer","Speed Rating":"Y","Load Index":"101","Rim":"20\""}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Pirelli' AND name='P Zero' AND spec='295/30R20 101Y');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Pirelli','Cinturato P7','235/45R18 94W','tires',219.99,274.99,true,9,'SUMMER','in',false,21,'Eco-friendly performance tire','Low rolling resistance meets sporty handling. Ideal for premium sedans.','[]','{"Season":"Summer","Speed Rating":"W","Load Index":"94","Rim":"18\""}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Pirelli' AND name='Cinturato P7' AND spec='235/45R18 94W');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Pirelli','Scorpion Verde','255/50R20 109H','tires',259.99,324.99,true,11,'ALL-SEASON','in',false,22,'Premium SUV all-season tire','Designed for luxury SUVs. Quiet, comfortable, and highly capable in wet conditions.','[]','{"Season":"All-Season","Speed Rating":"H","Load Index":"109","Rim":"20\""}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Pirelli' AND name='Scorpion Verde' AND spec='255/50R20 109H');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Pirelli','Winter Sottozero 3','245/45R18 100V','tires',249.99,312.49,true,10,'WINTER','in',false,23,'Luxury winter tire','Designed for premium performance cars. Superior steering precision in cold conditions.','[]','{"Season":"Winter","Speed Rating":"V","Load Index":"100","Rim":"18\""}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Pirelli' AND name='Winter Sottozero 3' AND spec='245/45R18 100V');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Pirelli','P Zero Rosso','275/35R20 102Y','tires',449.99,562.49,true,19,'TRACK','low',true,24,'Track-focused ultra high performance','P Zero Rosso: red compound technology for the highest levels of grip. Race-bred.','[]','{"Season":"Summer","Speed Rating":"Y","Load Index":"102","Rim":"20\""}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Pirelli' AND name='P Zero Rosso' AND spec='275/35R20 102Y');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Pirelli','Cinturato All Season','205/60R16 96V','tires',149.99,187.49,true,6,'ALL-SEASON','in',false,25,'Versatile all-season performer','Year-round confidence for compact and mid-size cars. Wet and dry balanced compound.','[]','{"Season":"All-Season","Speed Rating":"V","Load Index":"96","Rim":"16\""}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Pirelli' AND name='Cinturato All Season' AND spec='205/60R16 96V');

-- Bridgestone (6)
INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Bridgestone','Potenza Sport','225/45R18 95Y','tires',229.99,287.49,true,10,'SUMMER','in',true,30,'Maximum grip summer performance tire','Potenza Sport delivers track-level performance in a street tire. Enhanced braking and cornering.','[]','{"Season":"Summer","Speed Rating":"Y","Load Index":"95","Rim":"18\""}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Bridgestone' AND name='Potenza Sport' AND spec='225/45R18 95Y');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Bridgestone','Blizzak WS90','225/45R18 95H','tires',215.99,269.99,true,9,'WINTER','in',true,31,'Industry-leading winter tire','Blizzak compound absorbs water between tire and ice for unmatched cold traction.','[]','{"Season":"Winter","Speed Rating":"H","Load Index":"95","Rim":"18\""}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Bridgestone' AND name='Blizzak WS90' AND spec='225/45R18 95H');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Bridgestone','Dueler H/T 685','265/65R17 112S','tires',169.99,212.49,true,7,'ALL-TERRAIN','in',false,32,'Highway terrain for trucks/SUVs','Smooth highway ride with excellent all-season traction for light trucks.','[]','{"Season":"All-Season","Speed Rating":"S","Load Index":"112","Rim":"17\""}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Bridgestone' AND name='Dueler H/T 685' AND spec='265/65R17 112S');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Bridgestone','Turanza T005','215/50R17 95W','tires',155.99,194.99,true,6,'TOURING','in',false,33,'Comfortable touring tire','Low noise, long wear, excellent wet performance for family sedans and wagons.','[]','{"Season":"Summer","Speed Rating":"W","Load Index":"95","Rim":"17\""}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Bridgestone' AND name='Turanza T005' AND spec='215/50R17 95W');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Bridgestone','Ecopia EP422 Plus','205/55R16 91H','tires',119.99,149.99,true,5,'ECO','in',false,34,'Fuel-saving eco touring tire','Low rolling resistance saves fuel. Quiet ride with long tread life.','[]','{"Season":"All-Season","Speed Rating":"H","Load Index":"91","Rim":"16\""}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Bridgestone' AND name='Ecopia EP422 Plus' AND spec='205/55R16 91H');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Bridgestone','Potenza RE-71R','225/45R17 94W','tires',189.99,237.49,true,8,'TRACK','low',false,35,'Extreme performance summer','Maximum dry grip for autocross and track days. Soft compound.','[]','{"Season":"Summer","Speed Rating":"W","Load Index":"94","Rim":"17\""}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Bridgestone' AND name='Potenza RE-71R' AND spec='225/45R17 94W');

-- Continental (5)
INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Continental','ExtremeContact Sport 02','245/45R18 100Y','tires',219.99,274.99,true,9,'SUMMER','in',true,40,'Best-in-class dry and wet handling','SportPlus Technology with G3 compound for extreme summer performance.','[]','{"Season":"Summer","Speed Rating":"Y","Load Index":"100","Rim":"18\""}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Continental' AND name='ExtremeContact Sport 02' AND spec='245/45R18 100Y');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Continental','WinterContact TS 860','225/50R17 98H','tires',199.99,249.99,true,8,'WINTER','in',false,41,'Safe and efficient winter driving','Outstanding wet and snow handling with new silica compound for cold temperatures.','[]','{"Season":"Winter","Speed Rating":"H","Load Index":"98","Rim":"17\""}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Continental' AND name='WinterContact TS 860' AND spec='225/50R17 98H');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Continental','TrueContact Tour','205/60R16 92H','tires',129.99,162.49,true,5,'TOURING','in',false,42,'Long-lasting all-season touring','65,000-mile tread warranty. EcoPlus technology for fuel savings.','[]','{"Season":"All-Season","Speed Rating":"H","Load Index":"92","Rim":"16\""}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Continental' AND name='TrueContact Tour' AND spec='205/60R16 92H');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Continental','CrossContact LX25','235/65R17 108H','tires',179.99,224.99,true,7,'ALL-SEASON','in',false,43,'SUV all-season confidence','Optimized for SUVs and CUVs. Superior wet grip and braking performance.','[]','{"Season":"All-Season","Speed Rating":"H","Load Index":"108","Rim":"17\""}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Continental' AND name='CrossContact LX25' AND spec='235/65R17 108H');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Continental','Viking 7','205/60R16 96H','tires',159.99,199.99,true,7,'WINTER','in',false,44,'Winter tire with driving stability','EvenWear construction for consistent grip throughout tire life in winter.','[]','{"Season":"Winter","Speed Rating":"H","Load Index":"96","Rim":"16\""}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Continental' AND name='Viking 7' AND spec='205/60R16 96H');

-- Goodyear (5)
INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Goodyear','Eagle F1 Asymmetric 6','255/40R19 100Y','tires',269.99,337.49,true,11,'SUMMER','in',true,50,'Flagship ultra-high performance summer','Goodyear''s finest: exceptional grip in dry and wet with longer tread life.','[]','{"Season":"Summer","Speed Rating":"Y","Load Index":"100","Rim":"19\""}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Goodyear' AND name='Eagle F1 Asymmetric 6' AND spec='255/40R19 100Y');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Goodyear','UltraGrip Ice Arctic 2','225/55R17 101T','tires',189.99,237.49,true,8,'WINTER','in',false,51,'Arctic-grade winter performance','Tri-Directional sipes and SnowGrip compound for extreme winter conditions.','[]','{"Season":"Winter","Speed Rating":"T","Load Index":"101","Rim":"17\""}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Goodyear' AND name='UltraGrip Ice Arctic 2' AND spec='225/55R17 101T');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Goodyear','Wrangler TrailRunner AT','265/70R17 121S','tires',219.99,274.99,true,9,'ALL-TERRAIN','in',false,52,'All-terrain for trucks and SUVs','Duraguard Technology for puncture resistance. Enhanced off-road traction.','[]','{"Season":"All-Season","Speed Rating":"S","Load Index":"121","Rim":"17\""}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Goodyear' AND name='Wrangler TrailRunner AT' AND spec='265/70R17 121S');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Goodyear','Assurance WeatherReady 2','225/65R17 102H','tires',169.99,212.49,true,7,'ALL-SEASON','in',false,53,'All-weather confidence year-round','3-peak snowflake rated. Wet, dry, and snow capable for family vehicles.','[]','{"Season":"All-Season","Speed Rating":"H","Load Index":"102","Rim":"17\""}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Goodyear' AND name='Assurance WeatherReady 2' AND spec='225/65R17 102H');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Goodyear','ElectricDrive GT','235/40R19 96W','tires',239.99,299.99,true,10,'EV','in',false,54,'Engineered for electric vehicles','Low rolling resistance, high load capacity, and reduced noise for EVs.','[]','{"Season":"Summer","Speed Rating":"W","Load Index":"96","Rim":"19\""}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Goodyear' AND name='ElectricDrive GT' AND spec='235/40R19 96W');

-- Yokohama (4)
INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Yokohama','Advan Sport V107','275/35R20 102Y','tires',319.99,399.99,true,13,'SUMMER','in',true,60,'Premium OEM fitment summer tire','ADVAN Sport V107 is fitted on Porsche, BMW, and Mercedes-AMG as original equipment.','[]','{"Season":"Summer","Speed Rating":"Y","Load Index":"102","Rim":"20\""}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Yokohama' AND name='Advan Sport V107' AND spec='275/35R20 102Y');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Yokohama','Geolandar X-CV','265/50R20 111V','tires',249.99,312.49,true,10,'ALL-TERRAIN','in',false,61,'Premium SUV all-season CUV tire','Advanced compound for quiet highway cruising and responsive cornering.','[]','{"Season":"All-Season","Speed Rating":"V","Load Index":"111","Rim":"20\""}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Yokohama' AND name='Geolandar X-CV' AND spec='265/50R20 111V');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Yokohama','iceGUARD iG53','225/50R18 95H','tires',199.99,249.99,true,8,'WINTER','in',false,62,'Silent winter tire technology','Orange Oil compound for flexibility in freezing temperatures. Exceptional ice grip.','[]','{"Season":"Winter","Speed Rating":"H","Load Index":"95","Rim":"18\""}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Yokohama' AND name='iceGUARD iG53' AND spec='225/50R18 95H');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Yokohama','Advan Neova AD09','245/40R17 95W','tires',229.99,287.49,true,10,'TRACK','low',false,63,'Track-day performance semi-slick','Competition-oriented compound for maximum dry grip. Autocross favorite.','[]','{"Season":"Summer","Speed Rating":"W","Load Index":"95","Rim":"17\""}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Yokohama' AND name='Advan Neova AD09' AND spec='245/40R17 95W');

-- Dunlop (4)
INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Dunlop','Sport Maxx RT2','245/40R18 97Y','tires',209.99,262.49,true,9,'SUMMER','in',false,70,'Track-biased summer performance','Max Flange Shield protects alloy wheels. Strong braking on both wet and dry.','[]','{"Season":"Summer","Speed Rating":"Y","Load Index":"97","Rim":"18\""}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Dunlop' AND name='Sport Maxx RT2' AND spec='245/40R18 97Y');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Dunlop','Winter Maxx 3','205/55R16 91H','tires',149.99,187.49,true,6,'WINTER','in',false,71,'Proven winter performance','Multi-cell compound prevents water film buildup on ice. Reliable in extreme cold.','[]','{"Season":"Winter","Speed Rating":"H","Load Index":"91","Rim":"16\""}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Dunlop' AND name='Winter Maxx 3' AND spec='205/55R16 91H');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Dunlop','AT20 GrandTrek','265/60R18 110H','tires',189.99,237.49,true,8,'ALL-TERRAIN','in',false,72,'All-terrain for 4x4 trucks','Strong sidewall construction handles rough terrain without sacrificing on-road comfort.','[]','{"Season":"All-Terrain","Speed Rating":"H","Load Index":"110","Rim":"18\""}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Dunlop' AND name='AT20 GrandTrek' AND spec='265/60R18 110H');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Dunlop','Signature HP','235/50R18 97V','tires',139.99,174.99,true,6,'TOURING','in',false,73,'Grand touring tire for sedans','Precise cornering with comfortable long-distance ride quality.','[]','{"Season":"Summer","Speed Rating":"V","Load Index":"97","Rim":"18\""}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Dunlop' AND name='Signature HP' AND spec='235/50R18 97V');

-- Hankook (4)
INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Hankook','Ventus S1 evo3','245/35R20 95Y','tires',259.99,324.99,true,11,'SUMMER','in',false,80,'OEM for Audi, BMW sport models','Innovative tread compound with unique design for high-speed stability and wet safety.','[]','{"Season":"Summer","Speed Rating":"Y","Load Index":"95","Rim":"20\""}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Hankook' AND name='Ventus S1 evo3' AND spec='245/35R20 95Y');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Hankook','Winter i*cept IZ3','225/45R17 94T','tires',169.99,212.49,true,7,'WINTER','in',false,81,'Quiet winter tire with ice control','Zig-zag sipes and snow-traction notches for confident winter driving.','[]','{"Season":"Winter","Speed Rating":"T","Load Index":"94","Rim":"17\""}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Hankook' AND name='Winter i*cept IZ3' AND spec='225/45R17 94T');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Hankook','Dynapro AT2','265/65R17 112T','tires',179.99,224.99,true,7,'ALL-TERRAIN','in',false,82,'Rugged all-terrain for trucks','Off-road ready with DuraGuard sidewall protection and stone ejectors.','[]','{"Season":"All-Terrain","Speed Rating":"T","Load Index":"112","Rim":"17\""}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Hankook' AND name='Dynapro AT2' AND spec='265/65R17 112T');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Hankook','Kinergy GT','215/60R16 95H','tires',109.99,137.49,true,5,'TOURING','in',false,83,'Value grand touring tire','Exceptional value with long tread life and consistent wet and dry performance.','[]','{"Season":"All-Season","Speed Rating":"H","Load Index":"95","Rim":"16\""}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Hankook' AND name='Kinergy GT' AND spec='215/60R16 95H');

-- Nitto + BFGoodrich (4)
INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Nitto','NT555 G2','275/40R20 106W','tires',289.99,362.49,true,12,'SUMMER','in',false,90,'Ultra-high performance summer','Asymmetric tread with 3D interlocking sipes for advanced dry and wet traction.','[]','{"Season":"Summer","Speed Rating":"W","Load Index":"106","Rim":"20\""}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Nitto' AND name='NT555 G2' AND spec='275/40R20 106W');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Nitto','Ridge Grappler','285/70R17 121Q','tires',249.99,312.49,true,10,'ALL-TERRAIN','in',true,91,'Hybrid terrain — road and trail','Variable pitch tread eliminates road noise while delivering off-road durability.','[]','{"Season":"All-Terrain","Speed Rating":"Q","Load Index":"121","Rim":"17\""}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Nitto' AND name='Ridge Grappler' AND spec='285/70R17 121Q');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'BFGoodrich','All-Terrain T/A KO2','265/70R17 121S','tires',229.99,287.49,true,10,'ALL-TERRAIN','in',true,92,'Most popular off-road tire in North America','CoreGard Technology for split and bruise resistance. Unmatched off-road toughness.','[]','{"Season":"All-Terrain","Speed Rating":"S","Load Index":"121","Rim":"17\""}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='BFGoodrich' AND name='All-Terrain T/A KO2' AND spec='265/70R17 121S');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'BFGoodrich','g-Force Sport COMP-2','245/45R18 100W','tires',199.99,249.99,true,8,'SUMMER','in',false,93,'Performance summer for spirited driving','g-Force compound for extreme cornering. 45-day test-drive guarantee.','[]','{"Season":"Summer","Speed Rating":"W","Load Index":"100","Rim":"18\""}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='BFGoodrich' AND name='g-Force Sport COMP-2' AND spec='245/45R18 100W');

-- ── WHEELS & RIMS (20 products) ──────────────────────────────

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'BBS','CH-R','19×8.5 5×120','wheels',799.99,999.99,false,33,'FORGED','in',true,200,'Flow-formed lightweight wheel','Iconic BBS design. Incredibly strong and lightweight. Available in satin black and silver.','[]','{"Material":"Flow-formed aluminum","Finish":"Satin Black","Bolt Pattern":"5×120","Offset":"ET35"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='BBS' AND name='CH-R' AND spec='19×8.5 5×120');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'BBS','RS-GT','18×8 5×112','wheels',1199.99,1499.99,false,50,'FORGED','in',false,201,'Motorsport forged wheel','As seen in DTM and Formula E. True monoblock forged construction.','[]','{"Material":"Forged aluminum","Finish":"Matte Gold","Bolt Pattern":"5×112","Offset":"ET30"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='BBS' AND name='RS-GT' AND spec='18×8 5×112');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'BBS','FI-R','20×8.5 5×114.3','wheels',1499.99,1874.99,false,62,'FORGED','low',true,202,'Ultra-premium forged 3-piece','Handcrafted in Germany. Adjustable width and custom finishes available.','[]','{"Material":"3-piece forged","Finish":"Brushed Silver","Bolt Pattern":"5×114.3","Offset":"ET38"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='BBS' AND name='FI-R' AND spec='20×8.5 5×114.3');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'BBS','LM-R','17×7.5 5×100','wheels',699.99,874.99,false,29,'FORGED','in',false,203,'Classic LM design reborn','The legendary LM in modern sizing. Polished lip with black center.','[]','{"Material":"Flow-formed","Finish":"Polished/Black","Bolt Pattern":"5×100","Offset":"ET35"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='BBS' AND name='LM-R' AND spec='17×7.5 5×100');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Vossen','HF-5','20×10.5 5×112','wheels',899.99,1124.99,false,37,'CAST','in',true,210,'Precision cast luxury wheel','Directional 7-spoke design. Matte graphite finish with diamond cut lip.','[]','{"Material":"Cast aluminum","Finish":"Matte Graphite","Bolt Pattern":"5×112","Offset":"ET45"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Vossen' AND name='HF-5' AND spec='20×10.5 5×112');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Vossen','CV3-R','19×9.5 5×114.3','wheels',749.99,937.49,false,31,'FLOW FORMED','in',false,211,'Flow-formed concave design','Deep concave profile. Popular fitment for JDM and Euro performance cars.','[]','{"Material":"Flow-formed","Finish":"Gloss Black","Bolt Pattern":"5×114.3","Offset":"ET40"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Vossen' AND name='CV3-R' AND spec='19×9.5 5×114.3');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Vossen','VPS-315T','21×9 5×120','wheels',1099.99,1374.99,false,46,'FORGED','in',false,212,'Hybrid forged 3-piece wheel','Custom width and bolt pattern options. Tailored for BMW 5-series and M models.','[]','{"Material":"Hybrid forged","Finish":"Custom","Bolt Pattern":"5×120","Offset":"ET25"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Vossen' AND name='VPS-315T' AND spec='21×9 5×120');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'HRE','P40SC','20×10 5×130','wheels',1699.99,2124.99,false,71,'FORGED','low',true,220,'Monoblock forged for Porsche','Lightweight monoblock design. OEM fitment quality for 911 and Cayenne.','[]','{"Material":"Monoblock forged","Finish":"Satin Black","Bolt Pattern":"5×130","Offset":"ET42"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='HRE' AND name='P40SC' AND spec='20×10 5×130');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Enkei','TS-10','18×8 5×114.3','wheels',329.99,412.49,false,14,'CAST','in',true,230,'Sport design at great value','MAT technology for exceptional strength-to-weight ratio. Track-proven design.','[]','{"Material":"MAT cast","Finish":"White/Machined","Bolt Pattern":"5×114.3","Offset":"ET45"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Enkei' AND name='TS-10' AND spec='18×8 5×114.3');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Enkei','RPF1','15×7 4×100','wheels',249.99,312.49,false,10,'RACING','in',true,231,'Legendary lightweight racing wheel','The go-to wheel for autocross and track day enthusiasts. Incredibly light.','[]','{"Material":"MAT cast","Finish":"Silver","Bolt Pattern":"4×100","Offset":"ET35"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Enkei' AND name='RPF1' AND spec='15×7 4×100');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Enkei','NT03+M','18×9.5 5×114.3','wheels',379.99,474.99,false,16,'FLOW FORMED','in',false,232,'Flow-formed track wheel','EKG flow-forming process. Deep concave face. Ideal for stance and track builds.','[]','{"Material":"Flow-formed","Finish":"Hyper Silver","Bolt Pattern":"5×114.3","Offset":"ET40"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Enkei' AND name='NT03+M' AND spec='18×9.5 5×114.3');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Volk Racing','TE37 SL','17×9 5×114.3','wheels',1299.99,1624.99,false,54,'FORGED','low',true,240,'Iconic 6-spoke forged wheel','Volk Racing TE37 — arguably the most famous wheel ever made. Forged by RAYS Engineering.','[]','{"Material":"Forged aluminum","Finish":"Diamond Dark Gunmetal","Bolt Pattern":"5×114.3","Offset":"ET35"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Volk Racing' AND name='TE37 SL' AND spec='17×9 5×114.3');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Volk Racing','ZE40','19×8.5 5×112','wheels',1499.99,1874.99,false,62,'FORGED','in',false,241,'1-piece center lock forged','RAYS forged using VOLK''s advanced forging technique. Minimal weight for maximum performance.','[]','{"Material":"Forged","Finish":"Bright Bronze","Bolt Pattern":"5×112","Offset":"ET45"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Volk Racing' AND name='ZE40' AND spec='19×8.5 5×112');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'OZ Racing','Ultraleggera HLT','19×8 5×120','wheels',899.99,1124.99,false,37,'FORGED','in',false,250,'Ultra-lightweight forged','HLT technology delivers exceptional strength at minimum weight. Italian craftsmanship.','[]','{"Material":"HLT forged","Finish":"Matt Race Silver","Bolt Pattern":"5×120","Offset":"ET32"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='OZ Racing' AND name='Ultraleggera HLT' AND spec='19×8 5×120');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'OZ Racing','Alleggerita HLT','17×7.5 5×100','wheels',699.99,874.99,false,29,'FORGED','in',false,251,'Road/track dual-purpose wheel','Multiple award-winning design. HLT technology keeps weight under 6kg.','[]','{"Material":"HLT forged","Finish":"Superturismo Silver","Bolt Pattern":"5×100","Offset":"ET35"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='OZ Racing' AND name='Alleggerita HLT' AND spec='17×7.5 5×100');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Rotiform','BLQ','18×8.5 5×112','wheels',499.99,624.99,false,21,'CAST','in',false,260,'Multi-spoke Euro fitment','Bold multi-spoke design inspired by classic motorsport. Wide range of fitments.','[]','{"Material":"Cast aluminum","Finish":"Gloss Black","Bolt Pattern":"5×112","Offset":"ET40"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Rotiform' AND name='BLQ' AND spec='18×8.5 5×112');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Fuel Off-Road','Rebel 6','20×9 6×135','wheels',399.99,499.99,false,17,'CAST','in',false,270,'Aggressive off-road truck wheel','Deep lip design with bead grip technology. Designed for lifted trucks.','[]','{"Material":"Cast aluminum","Finish":"Matte Black","Bolt Pattern":"6×135","Offset":"ET-12"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Fuel Off-Road' AND name='Rebel 6' AND spec='20×9 6×135');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Method Race Wheels','MR305 NV','17×8.5 8×170','wheels',449.99,562.49,false,19,'CAST','in',false,271,'Off-road beadlock-ready wheel','NV design with no visible hardware. Engineered for heavy-duty truck applications.','[]','{"Material":"Cast aluminum","Finish":"Matte Black","Bolt Pattern":"8×170","Offset":"ET0"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Method Race Wheels' AND name='MR305 NV' AND spec='17×8.5 8×170');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'American Racing','AR901','18×8 5×114.3','wheels',299.99,374.99,false,12,'CAST','in',false,280,'Classic American muscle wheel','Iconic 5-spoke design rooted in American motorsport heritage. Polished finish.','[]','{"Material":"Cast aluminum","Finish":"Polished","Bolt Pattern":"5×114.3","Offset":"ET35"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='American Racing' AND name='AR901' AND spec='18×8 5×114.3');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Work Wheels','Emotion CR Kiwami','18×9.5 5×114.3','wheels',1199.99,1499.99,false,50,'FORGED','in',true,290,'JDM forged aluminum wheel','Iconic Japanese design. Deep dish profile. Custom order from Work in Osaka, Japan.','[]','{"Material":"Forged aluminum","Finish":"Diamond Cut","Bolt Pattern":"5×114.3","Offset":"ET38"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Work Wheels' AND name='Emotion CR Kiwami' AND spec='18×9.5 5×114.3');

-- ── SEATS (15 products) ──────────────────────────────────────

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Recaro','Sportster CS','Universal Fit','seats',599.99,749.99,false,25,'SPORT','in',true,300,'Road-legal bucket seat for street use','The Sportster CS balances everyday comfort with motorsport support. Suitable for most vehicles with adapter rails.','[]','{"Material":"Fabric/Alcantara","Side Bolster":"Adjustable","Recline":"Manual","Weight":"6.8 kg"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Recaro' AND name='Sportster CS' AND spec='Universal Fit');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Recaro','Pole Position ABE','Universal Fit','seats',1299.99,1624.99,false,54,'RACING','low',true,301,'FIA-approved racing shell seat','Fully homologated by FIA. Carbon fiber composite shell. Fits HANS device. Track and time attack ready.','[]','{"Material":"Carbon Fiber","FIA Certified":"Yes","Weight":"3.9 kg","Shell":"Carbon/Kevlar"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Recaro' AND name='Pole Position ABE' AND spec='Universal Fit');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Recaro','Cross Sportster CS','Universal Fit','seats',699.99,874.99,false,29,'SPORT','in',false,302,'Crossover sport seat for daily drivers','Enhanced side bolsters for sporty driving. 6-point harness compatible.','[]','{"Material":"Polyester fabric","Side Bolster":"Fixed","Recline":"Manual","Weight":"7.1 kg"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Recaro' AND name='Cross Sportster CS' AND spec='Universal Fit');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Recaro','RC Clubsport','Universal Fit','seats',879.99,1099.99,false,37,'RACING','in',false,303,'Club racing shell seat','Perfect for track days and club motorsport. Lightweight fiberglass shell.','[]','{"Material":"Fiberglass shell","FIA Certified":"No","Weight":"5.2 kg","Harness":"5-point compatible"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Recaro' AND name='RC Clubsport' AND spec='Universal Fit');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Recaro','Expert M','Universal Fit','seats',449.99,562.49,false,19,'COMFORT','in',false,304,'High-comfort sport touring seat','Orthopedically certified. Excellent for long drives with firm lumbar support.','[]','{"Material":"Microfiber","Side Bolster":"Adjustable","Lumbar":"Adjustable","Weight":"8.4 kg"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Recaro' AND name='Expert M' AND spec='Universal Fit');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Sparco','Pro 2000','Universal Fit','seats',849.99,1062.49,false,35,'FIA','in',true,310,'FIA-certified steel shell seat','Low-profile steel shell with side-mount options. Meets FIA 8855-1999 safety standards.','[]','{"Material":"Steel shell","FIA Certified":"8855-1999","Weight":"8.1 kg","Harness":"5-point compatible"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Sparco' AND name='Pro 2000' AND spec='Universal Fit');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Sparco','R100','Universal Fit','seats',349.99,437.49,false,15,'ENTRY','in',false,311,'Entry-level sport bucket seat','Perfect introduction to bucket seat driving. Steel shell with foam padding. Street legal.','[]','{"Material":"Polyester/Steel","FIA Certified":"No","Weight":"9.2 kg","Mounting":"Side brackets"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Sparco' AND name='R100' AND spec='Universal Fit');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Sparco','Sprint Sky LF','Universal Fit','seats',1099.99,1374.99,false,46,'FIA','low',false,312,'Lightweight FIA racing seat','Ultra-light fiberglass construction with superior lateral support for motorsport.','[]','{"Material":"Fiberglass","FIA Certified":"8862-2009","Weight":"4.8 kg","Harness":"HANS compatible"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Sparco' AND name='Sprint Sky LF' AND spec='Universal Fit');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Sparco','Evo QRT','Universal Fit','seats',749.99,937.49,false,31,'RALLY','in',false,313,'Rally-spec reclineable seat','Quick Release Technology for easy exit in emergencies. FIA rated.','[]','{"Material":"Carbon/Kevlar","FIA Certified":"8862-2009","Weight":"5.6 kg","Special":"Quick Release"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Sparco' AND name='Evo QRT' AND spec='Universal Fit');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Bride','ZETA III','Universal Fit','seats',1499.99,1874.99,false,62,'CARBON','low',true,320,'Full carbon fiber bucket seat','Bride''s finest: prepreg carbon with ultra-thin shell. Used in Super GT and rally racing.','[]','{"Material":"Carbon fiber prepreg","FIA Certified":"8862-2009","Weight":"3.2 kg","Origin":"Japan"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Bride' AND name='ZETA III' AND spec='Universal Fit');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Bride','GIAS II','Universal Fit','seats',999.99,1249.99,false,42,'RECLINING','in',false,321,'Reclining low-max bucket seat','Low-max design sits very close to floor for maximum headroom. Popular in Japanese drift cars.','[]','{"Material":"Carbon/Kevlar","Recline":"Yes","Weight":"5.1 kg","Origin":"Japan"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Bride' AND name='GIAS II' AND spec='Universal Fit');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Bride','VIOS III','Universal Fit','seats',849.99,1062.49,false,35,'RACING','in',false,322,'Side airbag compatible racing seat','Unique side-mount system compatible with OEM side airbags. Daily driver friendly.','[]','{"Material":"FRP shell","Side Airbag":"Compatible","Weight":"6.4 kg","Origin":"Japan"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Bride' AND name='VIOS III' AND spec='Universal Fit');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'OMP','HTE-R','Universal Fit','seats',1199.99,1499.99,false,50,'FIA','in',false,330,'FIA Carbon/Kevlar motorsport seat','Professional grade for circuit racing. FIA 8862-2009 certified carbon/Kevlar shell.','[]','{"Material":"Carbon/Kevlar","FIA Certified":"8862-2009","Weight":"4.1 kg","Finish":"Black"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='OMP' AND name='HTE-R' AND spec='Universal Fit');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'OMP','Stile-R','Universal Fit','seats',499.99,624.99,false,21,'SPORT','in',false,331,'Street sport reclining seat','Comfortable reclining sport seat for street use. Attractive red/black color option.','[]','{"Material":"Fabric/Steel","Recline":"Yes","FIA Certified":"No","Weight":"8.0 kg"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='OMP' AND name='Stile-R' AND spec='Universal Fit');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Corbeau','FX1 Pro','Universal Fit','seats',379.99,474.99,false,16,'SPORT','in',false,332,'Affordable sport seat with harness bar','Fixed-back sport seat with 5-point harness compatibility. Made in USA.','[]','{"Material":"Billet aluminum/fabric","FIA Certified":"No","Origin":"USA","Harness":"5-point compatible"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Corbeau' AND name='FX1 Pro' AND spec='Universal Fit');

-- ── ACCESSORIES (14 products) ────────────────────────────────

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'WeatherTech','FloorLiner DigitalFit','Vehicle Specific','accessories',149.99,187.49,false,6,'PROTECTION','in',false,400,'Custom-fit floor protection','Laser-measured for your exact vehicle. No-MAT system with anti-skid bottom.','[]','{"Material":"High-density tri-extruded","Color":"Black","Coverage":"Full coverage","Origin":"USA"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='WeatherTech' AND name='FloorLiner DigitalFit');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'WeatherTech','Cargo Liner','Vehicle Specific','accessories',99.99,124.99,false,4,'PROTECTION','in',false,401,'Custom cargo area liner','Protects cargo area from spills, mud, and gear. Raised edges prevent spillover.','[]','{"Material":"Tri-extruded","Color":"Black","Edges":"Raised 2\"","Origin":"USA"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='WeatherTech' AND name='Cargo Liner');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'WeatherTech','MudFlap HP','Universal — 4-piece','accessories',69.99,87.49,false,3,'PROTECTION','in',false,402,'No-drill mud flap system','Innovative no-drill design. Protects paint from rock chips and road debris.','[]','{"Material":"Durable polymer","Installation":"No-drill","Set":"4 flaps","Origin":"USA"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='WeatherTech' AND name='MudFlap HP');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'WeatherTech','Window Deflector','Vehicle Specific','accessories',59.99,74.99,false,2,'COMFORT','in',false,403,'Dark smoke rain guards','Allows fresh air in while blocking rain. Custom fit to your vehicle''s window.','[]','{"Material":"Acrylic","Shade":"Dark Smoke","Mount":"In-channel","Origin":"USA"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='WeatherTech' AND name='Window Deflector');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'K&N','High-Flow Air Filter','Drop-in Replacement','accessories',59.99,74.99,false,2,'PERFORMANCE','in',false,410,'Washable high-flow air filter','Up to 50% more airflow vs paper filters. Oiled cotton gauze. Washable and reusable.','[]','{"Media":"Oiled cotton gauze","Flow Increase":"Up to 50%","Washable":"Yes","Warranty":"Million-mile"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='K&N' AND name='High-Flow Air Filter');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'K&N','Cold Air Intake Kit','Vehicle Specific','accessories',299.99,374.99,false,12,'PERFORMANCE','in',true,411,'Dyno-proven horsepower gains','Complete kit with durable heat shield. Adds up to 15-25hp on most applications.','[]','{"HP Gain":"Up to 25hp","Torque":"+18 ft-lb","Includes":"Heat shield, filter, hardware","Warranty":"Limited lifetime"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='K&N' AND name='Cold Air Intake Kit');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'K&N','Cabin Air Filter','Vehicle Specific','accessories',24.99,31.24,false,1,'COMFORT','in',false,412,'Carbon-infused cabin filter','Removes pollen, dust, and odors. 10x the dirt capacity of standard cabin filters.','[]','{"Media":"Carbon-infused","Filtration":"HEPA-level","Washable":"No","Lifespan":"25,000 miles"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='K&N' AND name='Cabin Air Filter');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Borla','S-Type Cat-Back Exhaust','Vehicle Specific','accessories',849.99,1062.49,false,35,'EXHAUST','in',true,420,'Deep, aggressive sound without drone','T-304 stainless steel. Multi-core straight-through technology. 1 million-mile warranty.','[]','{"Material":"T-304 Stainless","Type":"Cat-back","Sound":"Aggressive","Warranty":"1 million miles"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Borla' AND name='S-Type Cat-Back Exhaust');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Borla','ATAK Cat-Back Exhaust','Vehicle Specific','accessories',1099.99,1374.99,false,46,'EXHAUST','low',false,421,'Maximum sound and performance','Loudest Borla system. Multiple inlets and outlets for optimal scavenging.','[]','{"Material":"T-304 Stainless","Type":"Cat-back","Sound":"Maximum","Tuning":"Racing optimized"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Borla' AND name='ATAK Cat-Back Exhaust');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'MagnaFlow','Competition Series Cat-Back','Vehicle Specific','accessories',699.99,874.99,false,29,'EXHAUST','in',false,430,'Performance exhaust with deep tone','100% stainless steel construction. Straight-through perforated core design.','[]','{"Material":"Stainless steel","Type":"Cat-back","Core":"Straight-through","Finish":"Polished tips"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='MagnaFlow' AND name='Competition Series Cat-Back');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'MagnaFlow','Direct-Fit Catalytic Converter','OBD-II Compliant','accessories',349.99,437.49,false,15,'EXHAUST','in',false,431,'EPA-compliant direct-fit converter','Pre-OBDII and post-OBDII options. Premium catalyst loading for better flow and conversion.','[]','{"Compliant":"EPA/CARB","Fit":"Direct OEM","Material":"Stainless body","Substrate":"Ceramic"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='MagnaFlow' AND name='Direct-Fit Catalytic Converter');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Husky Liners','X-act Contour Floor Liners','Vehicle Specific','accessories',119.99,149.99,false,5,'PROTECTION','in',false,440,'Premium custom floor liners','Patented X-act Fit technology. Rubberized material with deep channels to trap debris.','[]','{"Material":"Rubberized thermoplastic","Fit":"Custom laser-measured","Edges":"High side walls","Origin":"USA"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Husky Liners' AND name='X-act Contour Floor Liners');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Thule','WingBar Evo','Universal Aero Bar','accessories',199.99,249.99,false,8,'CARRIER','in',false,450,'Aero roof bar for load carrying','Quiet aerodynamic profile. Fits most vehicle roof rail systems. 100kg capacity per bar.','[]','{"Load Capacity":"100 kg","Noise":"Low profile aero","Mount":"T-slot","Compatibility":"Thule foot system"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Thule' AND name='WingBar Evo');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Yakima','FatCat EVO','Ski/Snowboard Carrier','accessories',279.99,349.99,false,12,'CARRIER','in',false,451,'Ski and snowboard carrier','Holds up to 6 skis or 4 snowboards. QuickDial mounting for tool-free install.','[]','{"Capacity":"6 skis / 4 boards","Mount":"QuickDial","Lock":"Keyed","Compatible":"Most round and aero bars"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Yakima' AND name='FatCat EVO');

-- ── LIFT KITS (15 products) ──────────────────────────────────

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Rough Country','2" Lift Kit — F-150','Ford F-150 2015-2023','lift-kits',299.99,374.99,false,12,'LEVELING','in',true,500,'Simple leveling lift for Ford F-150','Eliminates factory rake. Allows fitment of 33" tires. Easy DIY install in 2 hours.','[]','{"Lift Height":"2 inches","Application":"Ford F-150 2015-2023","Includes":"Strut spacers, alignment cams","Install Time":"2 hours"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Rough Country' AND name='2\" Lift Kit — F-150');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Rough Country','4" N3 Lift Kit — Silverado','Chevy Silverado 1500 2014-2018','lift-kits',599.99,749.99,false,25,'SUSPENSION','in',false,501,'Full suspension lift for Silverado','Allows 35" tire fitment. Includes new upper control arms, N3 shocks.','[]','{"Lift Height":"4 inches","Application":"Silverado 1500 2014-2018","Includes":"UCAs, shocks, spacers","Tire Clearance":"Up to 35 inches"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Rough Country' AND name='4\" N3 Lift Kit — Silverado');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Rough Country','6" Jeep JK Lift Kit','Jeep Wrangler JK 2007-2018','lift-kits',899.99,1124.99,false,37,'EXTREME','in',false,502,'Aggressive 6-inch Jeep lift','Conquers extreme terrain. Includes springs, shocks, control arms, and all hardware.','[]','{"Lift Height":"6 inches","Application":"JK Wrangler","Includes":"Springs, shocks, all hardware","Tire Clearance":"Up to 37 inches"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Rough Country' AND name='6\" Jeep JK Lift Kit');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Rough Country','3" RAM 1500 Leveling Kit','RAM 1500 2009-2023','lift-kits',249.99,312.49,false,10,'LEVELING','in',false,503,'Strut spacer leveling for RAM 1500','Clears up to 33" tires. Billet aluminum construction. Retains factory ride quality.','[]','{"Lift Height":"3 inches front","Application":"RAM 1500 2009-2023","Material":"Billet aluminum","Install":"Bolt-on"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Rough Country' AND name='3\" RAM 1500 Leveling Kit');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Fabtech','6" Performance Lift — Tacoma','Toyota Tacoma 2016-2023','lift-kits',1299.99,1624.99,false,54,'PERFORMANCE','low',true,510,'Premium performance lift for Tacoma','Full-travel suspension upgrade. Fabtech''s DL 2.5 coilovers with remote reservoirs.','[]','{"Lift Height":"6 inches","Application":"Tacoma 2016-2023","Shocks":"DL 2.5 coilovers","Reservoir":"Remote"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Fabtech' AND name='6\" Performance Lift — Tacoma');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Fabtech','4" Basic Lift — 4Runner','Toyota 4Runner 2010-2023','lift-kits',699.99,874.99,false,29,'SUSPENSION','in',false,511,'Capable 4-inch lift for 4Runner','Fits 33" tires. Includes new springs, strut spacers, and extended brake lines.','[]','{"Lift Height":"4 inches","Application":"4Runner 2010-2023","Tire Clearance":"33 inches","Includes":"Springs, spacers, brake lines"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Fabtech' AND name='4\" Basic Lift — 4Runner');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Fabtech','2" Sport Lift — Colorado/Canyon','GM Colorado/Canyon 2015-2022','lift-kits',449.99,562.49,false,19,'LEVELING','in',false,512,'Performance leveling for mid-size trucks','Uniball upper control arms for increased caster and better alignment. Lifts 2 inches.','[]','{"Lift Height":"2 inches","Application":"Colorado/Canyon 2015-2022","UCAs":"Uniball","Caster":"Corrected"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Fabtech' AND name='2\" Sport Lift — Colorado/Canyon');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Fabtech','3" Dodge Durango Lift','Dodge Durango 2011-2023','lift-kits',549.99,687.49,false,23,'SUSPENSION','in',false,513,'3-inch lift for Dodge Durango SUV','Perfect for Durango drivers wanting a modest lift with 33" tire capability.','[]','{"Lift Height":"3 inches","Application":"Durango 2011-2023","Includes":"Strut spacers, coil spacers","Alignment":"Required"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Fabtech' AND name='3\" Dodge Durango Lift');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'ReadyLIFT','2.5" SST Lift — Tundra','Toyota Tundra 2007-2021','lift-kits',349.99,437.49,false,15,'LEVELING','in',false,520,'Strut extension leveling for Tundra','Eliminates factory rake and allows 295/70R18 tires. Simple bolt-on install.','[]','{"Lift Height":"2.5 inches","Application":"Tundra 2007-2021","Type":"Strut extension","Install":"Bolt-on"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='ReadyLIFT' AND name='2.5\" SST Lift — Tundra');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'ReadyLIFT','3.5" Coil Spring Lift — Jeep JL','Jeep Wrangler JL 2018-2023','lift-kits',799.99,999.99,false,33,'SUSPENSION','in',false,521,'Significant lift for JL Wrangler','3.5" front and 1" rear. Fits 35" tires. Retains full factory droop.','[]','{"Lift Height":"3.5\" front / 1\" rear","Application":"JL Wrangler 2018-2023","Tire Clearance":"35 inches","Droop":"Full factory retained"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='ReadyLIFT' AND name='3.5\" Coil Spring Lift — Jeep JL');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'ReadyLIFT','4" Big Lift Kit — GMC Sierra','GMC Sierra 1500 2019-2023','lift-kits',1099.99,1374.99,false,46,'SUSPENSION','low',false,522,'Full lift kit for new-body Sierra','T6 billet aluminum components. Works with factory IRVM and all OEM features.','[]','{"Lift Height":"4 inches","Application":"Sierra 1500 2019-2023","Material":"T6 Billet Aluminum","OEM Features":"All retained"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='ReadyLIFT' AND name='4\" Big Lift Kit — GMC Sierra');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'BDS Suspension','4" Coilover System — Ford Bronco','Ford Bronco 2021-2023','lift-kits',1499.99,1874.99,false,62,'EXTREME','in',true,530,'Premier Bronco lift with remote shocks','Fox 2.5 remote reservoir coilovers. 4" of lift for 37" tires. Trail-tested and proven.','[]','{"Lift Height":"4 inches","Application":"Bronco 2021-2023","Shocks":"Fox 2.5 Remote Reservoir","Tire Clearance":"37 inches"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='BDS Suspension' AND name='4\" Coilover System — Ford Bronco');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'BDS Suspension','6" Lift — RAM 2500 Diesel','RAM 2500/3500 2014-2023','lift-kits',1199.99,1499.99,false,50,'HEAVY DUTY','in',false,531,'Heavy-duty 6-inch lift for diesel RAM','Designed for RAM 2500/3500 Cummins diesel. Handles towing and max payloads.','[]','{"Lift Height":"6 inches","Application":"RAM 2500/3500 2014-2023","Engine":"Diesel compatible","Towing":"Maintained rating"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='BDS Suspension' AND name='6\" Lift — RAM 2500 Diesel');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'BDS Suspension','3" Lift — Chevy Suburban','Chevy Suburban 2021-2023','lift-kits',599.99,749.99,false,25,'SUSPENSION','in',false,532,'3-inch UCA lift for full-size SUV','Upper control arm kit with shock extensions. Maintains AWD and electronic controls.','[]','{"Lift Height":"3 inches","Application":"Suburban 2021-2023","Includes":"UCAs, shock extensions","AWD":"Maintained"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='BDS Suspension' AND name='3\" Lift — Chevy Suburban');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Skyjacker','2" Suspension Lift — Gladiator','Jeep Gladiator JT 2020-2023','lift-kits',399.99,499.99,false,17,'LEVELING','in',false,535,'Purpose-built lift for Jeep Gladiator','Maintains factory towing capacity. Designed specifically for the JT''s longer wheelbase.','[]','{"Lift Height":"2 inches","Application":"Gladiator JT 2020-2023","Towing":"Factory capacity maintained","Install":"2-3 hours"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Skyjacker' AND name='2\" Suspension Lift — Gladiator');

-- ── BRAKES (15 products) ─────────────────────────────────────

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Brembo','GT 6-Piston BBK Front','Universal 14"','brakes',2299.99,2874.99,false,96,'BIG BRAKE','low',true,600,'6-piston monobloc big brake kit','Flagship Brembo GT kit. Monobloc aluminum calipers with cross-drilled and slotted rotors.','[]','{"Piston":"6-piston mono","Rotor Size":"14 inch","Material":"Aluminum caliper","Finish":"Red/Yellow/Black"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Brembo' AND name='GT 6-Piston BBK Front');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Brembo','Gran Turismo 4-Piston Kit','Universal 13"','brakes',1499.99,1874.99,false,62,'BIG BRAKE','in',false,601,'4-piston street/track kit','Perfect balance of street manners and track performance. Vented and cross-drilled rotors.','[]','{"Piston":"4-piston","Rotor Size":"13 inch","Vented":"Yes","Slotted":"Yes"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Brembo' AND name='Gran Turismo 4-Piston Kit');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Brembo','Xtra Drilled Rotors','Front Pair — Vehicle Spec','brakes',199.99,249.99,false,8,'UPGRADE','in',false,602,'Performance slotted and cross-drilled rotors','UV e-coating prevents corrosion. Cross-drilling for heat dissipation and improved bite.','[]','{"Type":"Cross-drilled + slotted","Coating":"UV e-coat","Pair":"Front 2 rotors","OEM Replacement":"Yes"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Brembo' AND name='Xtra Drilled Rotors');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Brembo','OE Replacement Pads','Front Set — Vehicle Spec','brakes',79.99,99.99,false,3,'OEM','in',false,603,'OEM-quality compound brake pads','Carbon Metallic compound for quiet, dust-free performance matching factory specs.','[]','{"Compound":"Carbon metallic","Noise":"Low dust/noise","Set":"Front 4 pads","Warranty":"24 months"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Brembo' AND name='OE Replacement Pads');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Brembo','Sport HP Brake Pads','Front Set','brakes',109.99,137.49,false,5,'PERFORMANCE','in',false,604,'Street/track sport brake pads','HP compound rated up to 750°C. Consistent stopping power from cold.','[]','{"Compound":"HP Carbon metallic","Temp Rating":"750°C","Application":"Street/Track","Noise":"Low"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Brembo' AND name='Sport HP Brake Pads');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'EBC','Greenstuff Street Pads','Front Set','brakes',64.99,81.24,false,3,'STREET','in',false,610,'Low-dust street brake pads','Green compound for low dust and noise. Gentle on rotors with excellent cold bite.','[]','{"Compound":"Green","Dust":"Very low","Break-in":"Minimal","Application":"Street"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='EBC' AND name='Greenstuff Street Pads');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'EBC','Redstuff Ceramic Pads','Front Set','brakes',89.99,112.49,false,4,'PERFORMANCE','in',false,611,'High-performance ceramic compound','Redstuff compound for high-performance cars. Fade-free up to 900°C.','[]','{"Compound":"Ceramic red","Temp Rating":"900°C","Dust":"Very low","Application":"Street/Track"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='EBC' AND name='Redstuff Ceramic Pads');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'EBC','Ultimax OEM Pads','Front Set','brakes',49.99,62.49,false,2,'OEM','in',false,612,'Factory equivalent quiet pads','Ultimax compound: direct OEM replacement with improved cold bite.','[]','{"Compound":"Ultimax","Quiet":"Yes","Break-in":"None","Application":"Daily driving"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='EBC' AND name='Ultimax OEM Pads');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'EBC','Grooved Brake Rotors','Front Pair','brakes',149.99,187.49,false,6,'UPGRADE','in',false,613,'Slotted rotors for improved pad bite','GD series grooved rotors. Constant wiping of pad surface keeps bite consistent.','[]','{"Type":"Grooved (slotted)","Pair":"Front 2","Coating":"Black e-coat","Compatible":"All EBC pads"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='EBC' AND name='Grooved Brake Rotors');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'StopTech','Street Touring Pads','Front Set','brakes',74.99,93.74,false,3,'STREET','in',false,620,'Consistent bite from cold to hot','Street Touring compound: quiet, low dust, excellent initial bite for street driving.','[]','{"Compound":"Street Touring","Dust":"Low","Noise":"Low","Application":"Street"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='StopTech' AND name='Street Touring Pads');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'StopTech','Trophy Sport Kit','Front 2-piston','brakes',799.99,999.99,false,33,'TRACK','in',false,621,'2-piston track-oriented brake upgrade','Designed for weekend track warriors. Significant improvement over OEM calipers.','[]','{"Piston":"2-piston","Caliper":"Aluminum","Rotor":"Slotted","Application":"Street/Track"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='StopTech' AND name='Trophy Sport Kit');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'StopTech','Power Slot Rotors','Front Pair','brakes',169.99,212.49,false,7,'UPGRADE','in',false,622,'Curved vane slotted rotors','Curved slots for progressive pad engagement. OEM-quality aesthetics with improved function.','[]','{"Type":"Curved slot","Vanes":"Curved","Pair":"Front","OEM Spec":"Yes"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='StopTech' AND name='Power Slot Rotors');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'StopTech','Stainless Brake Lines','Full Vehicle Set','brakes',119.99,149.99,false,5,'UPGRADE','in',false,623,'Stainless braided brake lines','Replace OEM rubber lines. Eliminates expansion for a firmer pedal feel immediately.','[]','{"Material":"Stainless braided","Pedal Feel":"Improved","Set":"Full vehicle","Included":"Fittings and hardware"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='StopTech' AND name='Stainless Brake Lines');

INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Wilwood','Superlite 6R Front Kit','Universal 13"','brakes',1199.99,1499.99,false,50,'BIG BRAKE','in',true,630,'6-piston Superlite big brake kit','Wilwood''s most popular kit. Radial mount 6-piston calipers with 13" two-piece rotors.','[]','{"Piston":"6-piston","Rotor":"Two-piece 13\"","Mount":"Radial","Finish":"Red/Black/Silver"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Wilwood' AND name='Superlite 6R Front Kit');


INSERT INTO products (brand,name,spec,category,price,original_price,discount_enabled,monthly,badge,stock,featured,sort_order,description,long_description,images,specs) SELECT 'Wilwood','DynaPro Front Kit','Universal 12.19"','brakes',849.99,1062.49,false,35,'PERFORMANCE','in',false,631,'4-piston forged aluminum kit','Compact DynaPro caliper in forged aluminum. Great for smaller vehicles needing big brake performance.','[]','{"Piston":"4-piston","Caliper":"Forged aluminum","Rotor":"12.19\"","Mount":"Lug drive"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Wilwood' AND name='DynaPro Front Kit');

-- ── END OF CATALOG ───────────────────────────────────────────
-- Total: ~122 products + 5 hero slides
-- All tires have discount_enabled=true with ~20% savings
