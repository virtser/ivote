# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

if Party.find_by(id: 1).nil?
    Party.create!(id: 1, name: 'הבית היהודי', code: 'טב')
end

if Party.find_by(id: 2).nil?
    Party.create!(id: 2, name: 'הליכוד', code: 'מחל')
end

if Party.find_by(id: 3).nil?
    Party.create!(id: 3, name: 'המחנה הציוני', code: 'אמת')
end

if Party.find_by(id: 4).nil?
    Party.create!(id: 4, name: 'השמאל של ישראל', code: 'מרצ')
end

if Party.find_by(id: 5).nil?
    Party.create!(id: 5, name: 'ישראל ביתנו', code: 'ל')
end

if Party.find_by(id: 6).nil?
    Party.create!(id: 6, name: 'כולנו', code: 'כ')
end

if Party.find_by(id: 7).nil?
    Party.create!(id: 7, name: 'יש עתיד', code: 'פה')
end

if Party.find_by(id: 8).nil?
    Party.create!(id: 8, name: 'הרשימה המשותפת', code: 'ודעם')
end

if Party.find_by(id: 9).nil?
    Party.create!(id: 9, name: 'יחד', code: 'קץ')
end

if Party.find_by(id: 10).nil?
    Party.create!(id: 10, name: 'יהדות התורה', code: 'ג')
end

if Party.find_by(id: 11).nil?
    Party.create!(id: 11, name: 'ש"ס', code: 'שס')
end

if Party.find_by(id: 12).nil?
    Party.create!(id: 12, name: 'הרשימה הערבית', code: 'ע')
end

if Party.find_by(id: 13).nil?
    Party.create!(id: 13, name: 'מפלגת כלכלה', code: 'ז')
end

if Party.find_by(id: 14).nil?
    Party.create!(id: 14, name: 'ובזכותן', code: 'נז')
end

if Party.find_by(id: 15).nil?
    Party.create!(id: 15, name: 'הירוקים', code: 'רק')
end

if Party.find_by(id: 16).nil?
    Party.create!(id: 16, name: 'עלה ירוק', code: 'קנ')
end

if Party.find_by(id: 17).nil?
    Party.create!(id: 17, name: 'מפלגת הדמוקראטורה', code: 'זך')
end

if Party.find_by(id: 18).nil?
    Party.create!(id: 18, name: 'מגנים על ילדינו', code: 'יך')
end

if Party.find_by(id: 19).nil?
    Party.create!(id: 19, name: 'שכירות בכבוד', code: 'י')
end

if Party.find_by(id: 20).nil?
    Party.create!(id: 20, name: 'אלאמל ללתג’ייר', code: 'יץ')
end

if Party.find_by(id: 21).nil?
    Party.create!(id: 21, name: 'מפלגת פרח', code: 'נץ')
end

if Party.find_by(id: 22).nil?
    Party.create!(id: 22, name: 'מנהיגות חברתית', code: 'יז')
end

if Party.find_by(id: 23).nil?
    Party.create!(id: 23, name: 'אור', code: 'נז')
end

if Party.find_by(id: 24).nil?
    Party.create!(id: 24, name: 'הפיראטים', code: 'ף')
end

if Party.find_by(id: 25).nil?
    Party.create!(id: 25, name: 'נבחרת העם', code: 'זץ')
end

if Party.find_by(id: 26).nil?
    Party.create!(id: 26, name: 'כולנו חברים', code: 'ףץ')
end

if Party.find_by(id: 27).nil?
    Party.create!(id: 27, name: 'לא מצביע', code: 'לא')
end