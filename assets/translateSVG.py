
import re 
inputFile = input("Please enter the name of your SVG file in this directory: ")

text = open(inputFile, "r").read()
text = re.sub("<!--.+?-->", "", text).replace("-->", "") 
text = re.sub("<\?xml.+?>", "", text)
text = re.sub("<!DOCTYPE.+?>", "", text)
allTags = re.finditer("(<|<\/)(\w+)?(?=>|\s)", text)
viewBox = re.findall('viewBox="([^"]+)', text)[0].split(" ")[2:]

for item in allTags:
	text = text.replace(item.group(0), item.group(0).title())
text = re.sub("<Svg[\w\W]+?>", f'<Svg width="{viewBox[0]}" height="{viewBox[1]}">', text)
stylingOptions = [*map(lambda x: x.replace('style="', ''), re.findall('style=".+?(?=")', text))]
newStyling = [] 
for options in stylingOptions:
	newString = ""
	for option in options.split(";"):
		option = option.replace(":","=")
		if "-" in option: option = "".join(map(lambda x: x[1].title() if x[0] != 0 else x[1], enumerate(option.split("-"))))
		if option:
			newString += f'{option.split("=")[0]}="{option.split("=")[1].lower()}" '
	newStyling.append(newString)

for index, item in enumerate(stylingOptions):
	oldString = f'style="{item}"'
	text = text.replace(oldString, newStyling[index])

print(text)