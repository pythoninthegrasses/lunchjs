-- * Development seed data for LunchJS
-- * Usage: sqlite3 ~/Library/Application\ Support/Lunch/lunch.db < scripts/dev_seed.sql
-- * Or via task: task db:seed

-- Clear existing data (optional - comment out to append instead)
DELETE FROM lunch_list;
DELETE FROM recent_lunch;

-- Seed restaurants
INSERT OR IGNORE INTO lunch_list (restaurants, option) VALUES
    ('Arbys', 'cheap'),
    ('Bubba''s', 'normal'),
    ('Charlestons', 'normal'),
    ('Firehouse', 'normal'),
    ('Freddies', 'normal'),
    ('Frosted Mug', 'normal'),
    ('Hideaway', 'normal'),
    ('Jersey Mike''s', 'normal'),
    ('Johnnies', 'normal'),
    ('Mcalisters', 'normal'),
    ('Mcneilies', 'normal'),
    ('Olive Garden', 'normal'),
    ('On The Border', 'normal'),
    ('Qdoba', 'normal'),
    ('Tamashii Ramen', 'normal'),
    ('Teds', 'normal'),
    ('The Mule', 'normal'),
    ('Zios', 'normal');
