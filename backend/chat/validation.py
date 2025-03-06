import re
from better_profanity import profanity

profanity.load_censor_words()


def custom_censor(text, censor_char='*'):
    # Convert every banned word to a string
    banned_words = {
        word.decode('utf-8') if isinstance(word, bytes) else str(word)
        for word in profanity.CENSOR_WORDSET
    }

    # Create a regex pattern to match whole banned words
    pattern = re.compile(
        r'\b(' + '|'.join(re.escape(word) for word in banned_words) + r')\b',
        flags=re.IGNORECASE
    )

    def replace(match):
        # Get the matched word
        word = match.group(0)
        # If the word is too short, do not censor it
        if len(word) <= 2:
            return word
        # Replace middle characters with the censor character
        return word[0] + (censor_char * (len(word) - 2)) + word[-1]

    # Replace all occurrences of banned words in the text
    return pattern.sub(replace, text)
